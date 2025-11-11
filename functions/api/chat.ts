import { createSupabaseClient, upsertChatSession, logMessage, hashIP } from '../../src/lib/supabase';
import { getSystemPrompt } from '../../src/lib/prompt';

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore[ip];

  if (!record || now > record.resetTime) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function validateMessage(message: string): boolean {
  if (!message || message.trim().length < 3) return false;
  if (message.length > 500) return false;

  const spamPatterns = /^(.)\1{10,}|https?:\/\//i;
  if (spamPatterns.test(message)) return false;

  return true;
}

// Cloudflare Pages Functions format
export async function onRequest(context: any) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { message, previousResponseId, sessionId } = await request.json();

    if (!validateMessage(message)) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client (only if credentials exist)
    let supabase = null;
    let dbSessionId = null;

    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        supabase = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // Create/update session
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const ipHash = await hashIP(ip);

        dbSessionId = await upsertChatSession(supabase, {
          session_id: sessionId || `session_${Date.now()}`,
          ip_hash: ipHash,
          user_agent: userAgent,
          metadata: {},
        });

        // Log user message (fire-and-forget, non-blocking)
        if (dbSessionId) {
          const userLogPromise = logMessage(supabase, {
            session_id: dbSessionId,
            role: 'user',
            content: message,
          }).catch(err => console.error('User message logging failed:', err));

          // Use waitUntil to ensure logging completes without blocking response
          context.waitUntil(userLogPromise);
        }
      } catch (error) {
        // Don't break chat if Supabase fails
        console.error('Supabase initialization failed:', error);
        supabase = null;
        dbSessionId = null;
      }
    }

    const systemPrompt = getSystemPrompt();

    const requestBody: any = {
      model: 'gpt-4o-mini',
      instructions: systemPrompt,
      input: [
        {
          type: 'message',
          role: 'user',
          content: message,
        },
      ],
      max_output_tokens: 250,
      stream: true,
    };

    if (previousResponseId) {
      requestBody.previous_response_id = previousResponseId;
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Stream response and collect assistant message for logging
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let assistantMessage = '';
    let openaiResponseId = '';
    let tokensUsed: number | undefined;

    // Process stream
    (async () => {
      try {
        const reader = response.body!.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);

                // Capture response ID
                if (
                  (parsed.type === 'response.created' || parsed.type === 'response.completed') &&
                  parsed.response?.id
                ) {
                  openaiResponseId = parsed.response.id;
                }

                // Capture tokens from response.completed event
                if (parsed.type === 'response.completed' && parsed.response?.usage) {
                  tokensUsed = parsed.response.usage.total_tokens;
                }

                // Capture assistant message content
                if (parsed.type === 'response.output_text.delta' && parsed.delta) {
                  assistantMessage += parsed.delta;
                }
              } catch (e) {
                // Ignore JSON parse errors
              }
            }
          }

          // Forward chunk to client
          await writer.write(value);
        }

        // Log assistant message to Supabase (fire-and-forget, non-blocking)
        if (supabase && dbSessionId && assistantMessage) {
          const logPromise = logMessage(supabase, {
            session_id: dbSessionId,
            role: 'assistant',
            content: assistantMessage,
            openai_response_id: openaiResponseId || undefined,
            tokens_used: tokensUsed,
          }).catch(err => console.error('Assistant message logging failed:', err));

          // Use waitUntil to ensure logging completes in background
          context.waitUntil(logPromise);
        }

        await writer.close();
      } catch (error) {
        console.error('Stream error:', error);
        await writer.abort(error);
      }
    })();

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

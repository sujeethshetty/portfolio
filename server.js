import express from 'express';
import { createSupabaseClient, upsertChatSession, logMessage, hashIP } from './src/lib/supabase.ts';
import { getSystemPrompt } from './src/lib/prompt.ts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

function validateMessage(message) {
  if (!message || message.trim().length < 3) return false;
  if (message.length > 500) return false;

  const spamPatterns = /^(.)\1{10,}|https?:\/\//i;
  if (spamPatterns.test(message)) return false;

  return true;
}

app.post('/api/chat', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please try again later.'
    });
  }

  const { message, previousResponseId, sessionId } = req.body;

  if (!validateMessage(message)) {
    return res.status(400).json({
      error: 'Invalid message. Must be 3-500 characters.'
    });
  }

  // Initialize Supabase (optional, won't break if not configured)
  let supabase = null;
  let dbSessionId = null;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      supabase = createSupabaseClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const userAgent = req.headers['user-agent'] || 'unknown';
      const ipHash = await hashIP(ip);

      dbSessionId = await upsertChatSession(supabase, {
        session_id: sessionId || `session_${Date.now()}`,
        ip_hash: ipHash,
        user_agent: userAgent,
        metadata: {},
      });

      // Log user message (non-blocking)
      if (dbSessionId) {
        logMessage(supabase, {
          session_id: dbSessionId,
          role: 'user',
          content: message,
        }).catch(err => console.error('User message logging failed:', err));
      }
    } catch (error) {
      console.error('Supabase error:', error);
    }
  }

  try {
    const systemPrompt = getSystemPrompt();

    // Build request body for Responses API
    const requestBody = {
      model: 'gpt-4o-mini',
      instructions: systemPrompt,
      input: [
        {
          type: 'message',
          role: 'user',
          content: message
        }
      ],
      max_output_tokens: 250,
      stream: true,
    };

    // Add previous_response_id if continuing conversation
    if (previousResponseId) {
      requestBody.previous_response_id = previousResponseId;
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let assistantMessage = '';
    let openaiResponseId = '';
    let tokensUsed = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Capture assistant message for logging
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6));

            // Capture response ID
            if ((parsed.type === 'response.created' || parsed.type === 'response.completed') && parsed.response?.id) {
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
            // Ignore parse errors
          }
        }
      }

      res.write(chunk);
    }

    // Log assistant message to Supabase (non-blocking)
    if (supabase && dbSessionId && assistantMessage) {
      logMessage(supabase, {
        session_id: dbSessionId,
        role: 'assistant',
        content: assistantMessage,
        openai_response_id: openaiResponseId || undefined,
        tokens_used: tokensUsed || undefined,
      }).catch(err => console.error('Assistant message logging failed:', err));
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Failed to process request'
      });
    }
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

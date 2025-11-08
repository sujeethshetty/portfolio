import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export interface ChatSession {
  id?: string;
  session_id: string;
  started_at?: string;
  ended_at?: string;
  message_count?: number;
  ip_hash?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id?: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  openai_response_id?: string;
  tokens_used?: number;
  metadata?: Record<string, any>;
}

/**
 * Hash IP address for privacy
 */
export function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

/**
 * Create Supabase client for server-side use
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string
): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Create or get chat session
 */
export async function upsertChatSession(
  supabase: SupabaseClient,
  sessionData: ChatSession
): Promise<string | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .upsert(
      {
        session_id: sessionData.session_id,
        ip_hash: sessionData.ip_hash,
        user_agent: sessionData.user_agent,
        metadata: sessionData.metadata || {},
      },
      {
        onConflict: 'session_id',
        ignoreDuplicates: false,
      }
    )
    .select('id')
    .single();

  if (error) {
    console.error('Error upserting session:', error);
    return null;
  }

  return data?.id || null;
}

/**
 * Log a message to the database
 */
export async function logMessage(
  supabase: SupabaseClient,
  message: ChatMessage
): Promise<boolean> {
  const { error } = await supabase.from('messages').insert({
    session_id: message.session_id,
    role: message.role,
    content: message.content,
    openai_response_id: message.openai_response_id,
    tokens_used: message.tokens_used,
    metadata: message.metadata || {},
  });

  if (error) {
    console.error('Error logging message:', error);
    return false;
  }

  return true;
}

/**
 * Increment message count for a session
 */
export async function incrementMessageCount(
  supabase: SupabaseClient,
  sessionId: string
): Promise<void> {
  await supabase.rpc('increment_message_count', { session_uuid: sessionId });
}

/**
 * Mark session as ended
 */
export async function endChatSession(
  supabase: SupabaseClient,
  sessionId: string
): Promise<void> {
  await supabase
    .from('chat_sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', sessionId);
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(
  supabase: SupabaseClient,
  sessionId: string
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching conversation:', error);
    return [];
  }

  return data || [];
}

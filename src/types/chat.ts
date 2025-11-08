export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  sessionId: string; // Unique session ID for Supabase tracking
  messages: Message[];
  messageCount: number;
  lastMessageTime: number;
  lastResponseId?: string; // OpenAI response ID for conversation chaining
}

export const MAX_MESSAGES_PER_SESSION = 10;
export const SESSION_STORAGE_KEY = 'chatbot-session';

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

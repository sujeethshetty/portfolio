-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  ip_hash TEXT, -- Hashed IP for privacy
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  openai_response_id TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for common queries
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_sessions_session_id ON chat_sessions(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to chat_sessions
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow service role to do everything)
CREATE POLICY "Service role can do everything on chat_sessions"
  ON chat_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on messages"
  ON messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for easy conversation viewing (SQL editor only)
-- This view is NOT accessible via API - only through SQL editor
CREATE VIEW conversation_view AS
SELECT
  s.id as session_id,
  s.session_id as client_session_id,
  s.started_at,
  s.message_count,
  m.id as message_id,
  m.role,
  m.content,
  m.created_at as message_time
FROM chat_sessions s
LEFT JOIN messages m ON s.id = m.session_id
ORDER BY s.started_at DESC, m.created_at ASC;

-- DO NOT grant to service_role - keep it restricted to SQL editor only
-- REVOKE all permissions except for postgres role
REVOKE ALL ON conversation_view FROM PUBLIC;
REVOKE ALL ON conversation_view FROM service_role;
REVOKE ALL ON conversation_view FROM anon;
REVOKE ALL ON conversation_view FROM authenticated;

-- Function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(session_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_sessions
  SET message_count = message_count + 1
  WHERE id = session_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE chat_sessions IS 'Stores chat session metadata';
COMMENT ON TABLE messages IS 'Stores individual messages in conversations';
COMMENT ON COLUMN chat_sessions.ip_hash IS 'SHA256 hash of IP address for privacy';
COMMENT ON COLUMN messages.openai_response_id IS 'OpenAI Responses API response ID for conversation chaining';

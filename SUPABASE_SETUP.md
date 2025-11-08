# Supabase Integration Setup

This guide walks you through setting up Supabase for conversation tracking.

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name:** portfolio-chatbot (or whatever you want)
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
5. Wait for project to initialize (~2 minutes)

## Step 2: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (bottom right)

You should see: "Success. No rows returned"

This creates:
- `chat_sessions` table
- `messages` table
- Indexes for performance
- Row Level Security policies
- Helper functions

## Step 3: Get API Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:

   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (starts with eyJ)
   - **service_role key:** `eyJhbGc...` (starts with eyJ, different from anon)

⚠️ **IMPORTANT:** The `service_role` key has admin access - NEVER expose it to the frontend!

## Step 4: Add to Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

   **For Production:**
   ```
   SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (service_role key)
   OPENAI_API_KEY = sk-proj-... (your existing key)
   ```

   **For Preview (optional):**
   - Add the same variables for preview deployments

4. Click **Save**

## Step 5: Deploy

Push your code to GitHub - Cloudflare Pages will auto-deploy.

The chatbot will now automatically log all conversations to Supabase!

## Step 6: View Conversations

### Option A: Supabase Dashboard (Quick & Easy)

1. Go to **Table Editor** in Supabase
2. Select `chat_sessions` to see all sessions
3. Select `messages` to see all messages
4. Use `conversation_view` for a combined view

### Option B: SQL Queries

In **SQL Editor**, try these queries:

**See all conversations today:**
```sql
SELECT * FROM conversation_view
WHERE started_at::date = CURRENT_DATE
ORDER BY started_at DESC;
```

**Find conversations mentioning "17 mile drive":**
```sql
SELECT DISTINCT s.session_id, s.started_at, m.content
FROM chat_sessions s
JOIN messages m ON s.id = m.session_id
WHERE m.content ILIKE '%17 mile%'
ORDER BY s.started_at DESC;
```

**Get most common questions:**
```sql
SELECT LEFT(content, 100) as question, COUNT(*) as times_asked
FROM messages
WHERE role = 'user'
GROUP BY LEFT(content, 100)
ORDER BY times_asked DESC
LIMIT 20;
```

**See conversations with suggestions:**
```sql
SELECT s.session_id, s.started_at, m.content
FROM chat_sessions s
JOIN messages m ON s.id = m.session_id
WHERE m.role = 'user'
  AND (
    m.content ILIKE '%should%'
    OR m.content ILIKE '%recommend%'
    OR m.content ILIKE '%suggest%'
  )
ORDER BY s.started_at DESC;
```

## Verification

To test it's working:

1. Deploy to Cloudflare Pages
2. Open your portfolio chatbot
3. Ask a question
4. Go to Supabase → **Table Editor** → `messages`
5. You should see your message logged!

## Data Model

### chat_sessions
- `id` - UUID primary key
- `session_id` - Client-side session ID (from localStorage)
- `started_at` - When session began
- `ended_at` - When session ended (if applicable)
- `message_count` - Number of messages in session
- `ip_hash` - SHA256 hash of IP (privacy-friendly)
- `user_agent` - Browser info
- `metadata` - Flexible JSON for future data

### messages
- `id` - UUID primary key
- `session_id` - Foreign key to chat_sessions
- `role` - 'user' or 'assistant'
- `content` - Message text
- `openai_response_id` - OpenAI response ID for chaining
- `tokens_used` - Optional token tracking
- `created_at` - Timestamp

## Privacy & GDPR

- IP addresses are **hashed** (SHA256) - not reversible
- No PII is stored
- Sessions are anonymous
- You can add a privacy policy mentioning conversation logging

## Cost

Supabase Free Tier includes:
- 500 MB database storage
- 2 GB bandwidth/month
- 50,000 monthly active users

For a portfolio chatbot, this is **more than enough** and costs **$0/month**.

## Troubleshooting

**Conversations not showing up?**
1. Check Cloudflare env vars are set correctly
2. Check Cloudflare Functions logs for errors
3. Verify SQL migration ran successfully
4. Make sure you're using `service_role` key, not `anon` key

**"relation does not exist" error?**
- Run the SQL migration again

**RLS policy errors?**
- Make sure you're using the `service_role` key in backend
- Never use `service_role` key in frontend!

## Next Steps (Optional)

Want daily email summaries of conversations?
1. Use Supabase Functions (serverless)
2. Schedule a daily cron job
3. Query conversations from last 24 hours
4. Send via email API (SendGrid, Resend, etc.)

Let me know if you want help setting this up!

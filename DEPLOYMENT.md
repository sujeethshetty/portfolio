# Deployment Guide

This document explains the deployment setup and key architectural decisions.

## Architecture Overview

The chatbot has two deployment modes:

1. **Local Development** (`npm run dev`)
   - Frontend: Vite dev server (port 5173)
   - Backend: Express server (`server.js`, port 3001)
   - Loads system prompt from files for rapid iteration

2. **Production** (Cloudflare Pages)
   - Frontend: Static assets via Cloudflare CDN
   - Backend: Cloudflare Pages Functions (serverless)
   - Uses bundled system prompt (see below)

## System Prompt Management

The chatbot's system prompt is managed in a single file: `src/lib/prompt.ts`

This file contains:
- System prompt template with instructions and rules
- Context about Sujeeth (bundled as a string constant)
- `cleanMarkdown()` function to reduce token usage (~14% savings)
- `getSystemPrompt()` function that combines template + context

### Benefits of Single File Approach
- **No sync issues:** Both local and production use the same file
- **Simplified maintenance:** Edit once, works everywhere
- **TypeScript support:** Better IDE autocomplete and type checking
- **Production-ready:** Already bundled, no filesystem access needed

### Updating the Prompt

**Process:**
1. Edit `src/lib/prompt.ts` (update `SYSTEM_PROMPT_TEMPLATE` or `ABOUT_ME_CONTENT`)
2. Test locally: `npm run dev`
3. Commit and push to trigger Cloudflare Pages deployment

## Environment Variables

### Required for Production

Add these to Cloudflare Pages → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Local Development

Copy `.env.example` to `.env` and fill in:

```bash
OPENAI_API_KEY=sk-proj-...
API_PORT=3001
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Deployment Steps

### Deploy to Cloudflare Pages

1. **Connect Repository**
   - Go to Cloudflare Pages Dashboard
   - Click "Create a project" → "Connect to Git"
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Environment Variables**
   - Add `OPENAI_API_KEY`
   - Add `SUPABASE_URL` (optional but recommended)
   - Add `SUPABASE_SERVICE_ROLE_KEY` (optional but recommended)

4. **Deploy**
   - Push to main branch → Auto-deploys
   - Or click "Retry deployment" in Cloudflare dashboard

### Supabase Setup

See `SUPABASE_SETUP.md` for detailed instructions on:
- Creating Supabase project
- Running database migrations
- Configuring environment variables
- Viewing conversation logs

## Cost Optimization

The chatbot is optimized for minimal cost:

1. **Markdown Stripping**: ~14% token reduction from cleaning formatting
2. **Conversation Chaining**: OpenAI Responses API with `previous_response_id` avoids resending full context
3. **Rate Limiting**: 15 requests/hour per IP, 10 questions per session
4. **Short Responses**: Max 350 tokens per response
5. **Prompt Caching**: OpenAI caches consistent system prompts (50-90% savings)
6. **GPT-4o-mini**: Efficient model for this use case

**Expected Cost:** ~$0.20-0.50/month for typical portfolio traffic

## Architecture Decisions

### Why OpenAI Responses API instead of Chat Completions API?

The Responses API provides built-in conversation state management via `previous_response_id`, eliminating the need to:
- Store full conversation history
- Resend all messages with each request
- Manage conversation context manually

This reduces token usage and simplifies the codebase.

### Why Cloudflare Pages instead of Vercel?

Both work fine, but Cloudflare Pages was chosen for:
- Generous free tier
- Built-in CDN
- Low latency globally
- Simple Functions API

If you prefer Vercel, the code in `api/chat.ts` (Vercel format) is also available - just needs the same prompt bundling approach.

### Why Supabase for Logging?

- PostgreSQL with good free tier
- Built-in table viewer (no custom admin panel needed)
- Row Level Security for privacy
- Easy SQL queries for insights

Supabase is optional - the chatbot works without it.

## Troubleshooting

### "Unknown file extension .ts" error locally
This is expected - `server.js` loads from `.txt` and `.md` files, not from `prompt.ts`.
The bundled module is only used in Cloudflare production.

### Chatbot not responding in production
1. Check Cloudflare Functions logs for errors
2. Verify `OPENAI_API_KEY` is set in environment variables
3. Check OpenAI API key has credits
4. Verify `src/lib/prompt.ts` is in sync with source files

### Different responses between local and production
The source files and bundled prompt are out of sync.
Update `src/lib/prompt.ts` with latest content from `.txt` and `.md` files.

### Supabase errors in Cloudflare logs
1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
2. Check you're using **service_role** key, not **anon** key
3. Verify SQL migration ran successfully

## Next Steps

- [ ] Add Supabase credentials (see `SUPABASE_SETUP.md`)
- [ ] Update contact placeholders in `about-me.md`:
  - Email address
  - Scheduling link (Calendly/Cal.com)
- [ ] Test chatbot in production after first deployment
- [ ] Monitor OpenAI API usage and costs
- [ ] Consider setting up daily conversation summary emails (optional)

## Files Reference

**Frontend:**
- `src/components/Chatbot.tsx` - Main chat UI
- `src/types/chat.ts` - TypeScript types

**Backend:**
- `functions/api/chat.ts` - Cloudflare Pages Function (production)
- `server.js` - Express server (local dev only)

**Prompt:**
- `src/lib/prompt.ts` - System prompt and context (single source of truth for all environments)

**Database:**
- `src/lib/supabase.ts` - Supabase utilities
- `supabase/migrations/001_initial_schema.sql` - Database schema

**Config:**
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

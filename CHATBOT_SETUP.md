# Chatbot Setup Guide

## Quick Start

### 1. Fill in your information
Edit `src/lib/prompt.ts` with your actual info. Be thorough - the more detail you provide, the better the chatbot will represent you. The file contains both the system prompt rules and the context about you.

### 2. Get an OpenAI API key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it somewhere safe

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and paste your API key:
```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**IMPORTANT:** Add `.env` to your `.gitignore` if it's not already there!

### 4. Run locally
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:8080 (Vite moves to the next free port if 8080 is taken)
- API server on http://localhost:3001

To show the blog posts section locally, also run the blog on port 4325:
```bash
npm --prefix blog run dev -- --port 4325
```

The chatbot button will appear in the bottom-right corner.

## Deployment (Cloudflare Pages)

Pushing to `main` deploys via `.github/workflows/deploy.yml`. In production the chat API runs as a
Cloudflare Pages Function (`functions/api/chat.ts`); locally it runs from `server.js`.

Set `OPENAI_API_KEY` in Cloudflare Pages → Settings → Environment Variables. See `DEPLOYMENT.md` for details.

## Model and Cost Management

The model and its settings live in one place, `CHAT_CONFIG` in `src/config/constants.ts`, and are
shared by `server.js` and `functions/api/chat.ts`:

```typescript
export const CHAT_CONFIG = {
  model: "gpt-6-luna",
  reasoningEffort: "none", // reasoning model: keep "none" so replies are fast and fit the cap
  maxOutputTokens: 250,
} as const;
```

`gpt-6-luna` is a reasoning model. With `reasoningEffort: "none"` every output token goes to the
answer. If you raise the effort, raise `maxOutputTokens` too, or replies can come back empty
because reasoning used up the cap. `"minimal"` is not accepted by gpt-6 models.

Check current per-token pricing for the model at https://openai.com/api/pricing.

### Built-in cost controls:
1. **Rate limiting:** 20 requests per IP per hour
2. **Session limiting:** 16 questions per user session
3. **Input validation:** Blocks spam and overly long messages
4. **Max response length:** Capped at 250 output tokens

## Testing

### Test the narrow focus:
1. Ask about your experience (should work)
2. Ask about weather (should reject)
3. Ask for general advice (should reject)

### Test rate limiting:
- Open multiple tabs and spam questions
- Should get rate limited after 20 requests

### Test the UI:
- Mobile responsiveness
- Streaming responses (should see words appear gradually)
- Dark/light mode support

## Customization

### Adjust question limits
Edit `src/types/chat.ts`:
```typescript
export const MAX_MESSAGES_PER_SESSION = 16; // Change this
```

### Adjust rate limits
Edit `functions/api/chat.ts` (production) and `server.js` (local):
```typescript
const MAX_REQUESTS_PER_WINDOW = 20; // Change this
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
```

### Change the model or response length
Edit `CHAT_CONFIG` in `src/config/constants.ts` (see Model and Cost Management above).

### Modify UI
The chatbot component is in `src/components/Chatbot.tsx`. It uses shadcn components, so styling follows your existing design system.

## Troubleshooting

### "Failed to get response"
- Check that your `.env` file has the correct API key
- Verify the API server is running (`npm run dev:api`)
- Check browser console for errors

### Streaming not working
- Make sure you're using a modern browser
- Check that the API endpoint is returning `text/event-stream`

### Rate limited immediately
- Clear localStorage in browser dev tools
- Restart the API server to clear in-memory rate limits

### Production chat not responding
- Ensure `OPENAI_API_KEY` is set in Cloudflare Pages environment variables
- Check the Pages Functions logs in the Cloudflare dashboard
- An empty reply usually means reasoning tokens used up `maxOutputTokens` (see above)

## Security Notes

1. **Never commit `.env`** - Your API key gives access to your OpenAI account
2. **Rate limiting is basic** - For production, consider using a proper rate limiting service
3. **No authentication** - Anyone can use the chatbot. That's intentional, but be aware.
4. **Prompt data is bundled** - `src/lib/prompt.ts` is compiled into the production bundle, so don't include sensitive information

## Future Improvements

- Add analytics to track what questions people ask
- Cache common Q&A pairs to reduce API costs
- Add a "typing" indicator during streaming
- Store chat history in a database instead of localStorage
- Add admin panel to view conversations

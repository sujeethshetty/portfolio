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
- Frontend on http://localhost:8080
- API server on http://localhost:3001

The chatbot button will appear in the bottom-right corner.

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add chatbot"
git push
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Import your repository
3. Add environment variable:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
4. Deploy!

The API routes will automatically work on Vercel.

## Cost Management

**Expected costs with GPT-5 Nano:**
- Input: $0.05 per 1M tokens
- Output: $0.40 per 1M tokens

**For a typical portfolio:**
- 100 visitors/month
- 5 questions each
- ~500 tokens per interaction
- **Total: ~$0.20/month**

### Built-in cost controls:
1. **Rate limiting:** 15 requests per IP per hour
2. **Session limiting:** 10 questions per user session
3. **Input validation:** Blocks spam and overly long messages
4. **Max response length:** Capped at 300 tokens

## Testing

### Test the narrow focus:
1. Ask about your experience (should work)
2. Ask about weather (should reject)
3. Ask for general advice (should reject)

### Test rate limiting:
- Open multiple tabs and spam questions
- Should get rate limited after 15 requests

### Test the UI:
- Mobile responsiveness
- Streaming responses (should see words appear gradually)
- Dark/light mode support

## Customization

### Adjust question limits
Edit `src/types/chat.ts`:
```typescript
export const MAX_MESSAGES_PER_SESSION = 10; // Change this
```

### Adjust rate limits
Edit `api/chat.ts` or `server.js`:
```typescript
const MAX_REQUESTS_PER_WINDOW = 15; // Change this
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
```

### Change response length
Edit the API call in `api/chat.ts` or `server.js`:
```typescript
max_tokens: 300, // Change this
temperature: 0.7, // Lower = more focused, higher = more creative
```

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

### Vercel deployment issues
- Ensure `OPENAI_API_KEY` is set in Vercel environment variables
- Check Vercel function logs for errors
- Verify `vercel.json` is in the root directory

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

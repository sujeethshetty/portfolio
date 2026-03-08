# Sujeeth's Portfolio

A modern, responsive portfolio website with an integrated blog and AI-powered chatbot.

| | |
|---|---|
| **Portfolio** | [sujeeth.io](https://sujeeth.io) |
| **Blog** | [blogs.sujeeth.io](https://blogs.sujeeth.io) |

## Features

- AI chatbot powered by GPT for answering questions about my background and work
- Dark/Light theme with synced preferences across portfolio and blog
- Interactive particle background (mobile-optimized)
- Integrated blog with latest posts pulled into the portfolio homepage
- Resume page with downloadable PDF
- Fully responsive design
- Deployed globally on Cloudflare Pages via GitHub Actions

## Tech Stack

### Portfolio
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router
- **Animations**: Custom CSS + Canvas API

### Blog
- **Framework**: Astro
- **Content**: MDX
- **Styling**: Tailwind CSS
- **Feed**: RSS support

### Infrastructure
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **AI**: OpenAI API (chatbot)

## Project Structure

```
├── src/                    # Portfolio (React)
│   ├── components/         # UI components, chatbot, particle background
│   ├── pages/              # Index, Resume
│   ├── data/               # Resume data
│   └── lib/                # Utilities, chatbot prompt
├── blog/                   # Blog (Astro)
│   └── src/
│       ├── content/blog/   # MDX blog posts
│       ├── layouts/        # Page layouts
│       └── pages/          # Routes + RSS + API
└── .github/workflows/      # CI/CD pipelines
```

## Development

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Portfolio
npm install
npm run dev

# Blog
cd blog
npm install
npm run dev
```

## Deployment

Both sites auto-deploy to Cloudflare Pages on push to `main`.

Required repository secrets:
- `CLOUDFLARE_API_TOKEN` — API token with Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID

## License

MIT — feel free to use as a template. See [LICENSE](LICENSE) for details.

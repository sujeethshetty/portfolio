# Sujeeth's Portfolio

A modern, responsive portfolio website showcasing my work as an AI & Data Engineer/Architect.

**Live Site**: [sujeeth.dev](https://sujeeth.dev)

## Features

- 🌗 Dark/Light theme toggle
- 🎨 Interactive particle background system
- 📱 Fully responsive design with mobile optimizations
- ⚡ Fast loading with Vite
- 🎯 Clean, professional layout
- 📄 Integrated resume page
- 🌍 Global CDN deployment on Cloudflare Pages
- 🚀 Automatic deployments via GitHub Actions

## Development

Requirements: Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone https://github.com/sujeethshetty/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router
- **Animations**: Custom CSS animations + Canvas API
- **Icons**: Lucide React + Simple Icons
- **Deployment**: Cloudflare Pages with GitHub Actions
- **Performance**: Mobile-optimized with reduced particle density and frame rate limiting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing section with particles
│   ├── About.tsx       # About section
│   ├── TechStack.tsx   # Technology showcase
│   ├── Projects.tsx    # Project portfolio
│   ├── Contact.tsx     # Contact form
│   └── ParticleBackground.tsx  # Interactive background
├── pages/              # Route pages
│   ├── Index.tsx       # Main portfolio page
│   └── Resume.tsx      # Resume page
└── lib/                # Utility functions
```

## Deployment

Automatically deployed to **Cloudflare Pages** via GitHub Actions on every push to main branch.

### Setup Requirements:
- Cloudflare account with Pages enabled
- Repository secrets configured:
  - `CLOUDFLARE_API_TOKEN`: API token with Pages:Edit permissions
  - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Benefits:
- **Global CDN**: 200+ edge locations worldwide
- **Better Performance**: Faster loading for international users
- **Free SSL**: Automatic HTTPS certificates
- **Unlimited Bandwidth**: No usage limits

The workflow builds the project and deploys to Cloudflare's global network, accessible at [sujeeth.dev](https://sujeeth.dev).

## License

MIT License - feel free to use this code as a template for your own portfolio! See [LICENSE](LICENSE) for details.

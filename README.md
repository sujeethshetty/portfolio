# Sujeeth's Portfolio

A modern, responsive portfolio website showcasing my work as an AI & Data Engineer/Architect.

**Live Site**: [sujeeth.dev](https://sujeeth.dev)

## Features

- 🌗 Dark/Light theme toggle
- 🎨 Interactive particle background system
- 📱 Fully responsive design
- ⚡ Fast loading with Vite
- 🎯 Clean, professional layout
- 📄 Integrated resume page
- 🚀 Deployed on GitHub Pages

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
- **Routing**: React Router (Hash routing for GitHub Pages)
- **Animations**: Custom CSS animations + Canvas API
- **Icons**: Lucide React + Simple Icons
- **Deployment**: GitHub Pages with GitHub Actions

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

Automatically deployed to GitHub Pages via GitHub Actions on every push to main branch.

The workflow builds the project and deploys to `gh-pages` branch, accessible at [sujeeth.dev](https://sujeeth.dev).

## License

MIT License - feel free to use this code as a template for your own portfolio! See [LICENSE](LICENSE) for details.

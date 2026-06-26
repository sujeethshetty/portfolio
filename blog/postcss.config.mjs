// Tailwind v3 + Autoprefixer via PostCSS (replaces the removed @astrojs/tailwind
// integration; Astro/Vite picks this config up automatically).
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// Self-hosted fonts (OFL-1.1), bundled by Vite from @fontsource:
// Geist = headings/body/UI, Geist Mono = code/tags, Kaushan Script = logo.
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/kaushan-script/400.css";
import './index.css'
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <App />
    </ThemeProvider>
  </StrictMode>
);

// Personal information and links
export const PERSONAL_INFO = {
  name: "Sujeeth Shetty",
  title: "AI & Data Engineering",
  email: "hello@sujeeth.io",
  location: "Atlanta, GA",
  linkedin: "https://www.linkedin.com/in/isujith/",
  github: "https://github.com/sujeethshetty",
  x: "https://x.com/xsujeeth",
  medium: "https://medium.com/@datadelight",
  resumeUrl: "https://drive.google.com/file/d/1BVeUiy5pmp33u56gnOYyMq78L7brgFLD/view?usp=sharing",
  calendlyUrl: "https://calendly.com/sujeeth-data/30min",
  topmateUrl: "https://topmate.io/sujshe/1667884?utm_source=public_profile&utm_campaign=sujshe"
} as const;

export const CHAT_CONFIG = {
  model: "gpt-6-luna",
  // gpt-6-luna is a reasoning model. "none" keeps replies fast and stops reasoning
  // tokens from eating the output cap. ("minimal" is rejected by gpt-6 models.)
  reasoningEffort: "none",
  maxOutputTokens: 250,
} as const;

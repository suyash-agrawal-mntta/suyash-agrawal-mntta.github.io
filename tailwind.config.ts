import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
        },
        accent: {
          primary: "var(--accent-primary)",
        },
        text: {
          main: "var(--text-main)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        headline: ["var(--font-space-grotesk)"],
      },
    },
  },
  plugins: [],
};
export default config;

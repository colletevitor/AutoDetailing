import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F97316",
          orangeLight: "#FB923C",
          dark: "#0A0A0B",
          card: "#111113",
          cardHover: "#18181B",
          border: "#27272A",
          borderLight: "#3F3F46",
          text: "#FAFAFA",
          muted: "#A1A1AA",
          subtle: "#52525B",
        }
      }
    },
  },
  plugins: [],
};
export default config;

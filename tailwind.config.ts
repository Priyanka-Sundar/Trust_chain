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
        cream: {
          50: "#FBF8F2",
          100: "#F8F4ED",
          200: "#F0E9DC",
          300: "#E5DBC8",
          400: "#D4C5A9",
          500: "#BFA882",
        },
        ink: {
          50: "#F5F5F5",
          100: "#E5E5E5",
          900: "#1A1A1A",
          950: "#0F0F0F",
        },
        terracotta: {
          400: "#D97852",
          500: "#C0392B",
          600: "#A5281B",
        },
        sage: {
          400: "#8FB87A",
          500: "#6FA058",
          600: "#5A8645",
        },
        gold: {
          400: "#E8C547",
          500: "#D4A017",
        },
        dusty: {
          400: "#B8A4C9",
          500: "#9B82B0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

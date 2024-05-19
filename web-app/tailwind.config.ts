import { nextui } from "@nextui-org/react";
import scrollbar from "tailwind-scrollbar";

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        sm: "clamp(0.8rem, 0.17vw + 0.76rem, 0.89rem)",
        base: "clamp(1rem, 0.34vw + 0.91rem, 1.19rem)",
        lg: "clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem)",
        xl: "clamp(1.56rem, 1vw + 1.31rem, 2.11rem)",
        "2xl": "clamp(1.95rem, 1.56vw + 1.56rem, 2.81rem)",
        "3xl": "clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem)",
        "4xl": "clamp(3.05rem, 3.54vw + 2.17rem, 5rem)",
        "5xl": "clamp(3.81rem, 5.18vw + 2.52rem, 6.66rem)",
        "6xl": "clamp(4.77rem, 7.48vw + 2.9rem, 8.88rem)",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        abeezee: ["ABeeZee", "sans-serif"],
        sans: ["ABeeZee", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--nextui-default))",
        input: "hsl(var(--nextui-default))",
        ring: "hsl(var(--nextui-focus))",
        destructive: {
          DEFAULT: "hsl(var(--nextui-danger))",
          foreground: "hsl(var(--nextui-danger-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--nextui-secondary))",
          foreground: "hsl(var(--nextui-secondary-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--nextui-content1-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--nextui-content1))",
          foreground: "hsl(var(--nextui-content1-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--nextui-radius-large)",
        md: "var(--nextui-radius-medium)",
        sm: "var(--nextui-radius-small)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.2s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    scrollbar({ nocompatible: true, preferredStrategy: "pseudoelements" }),
    nextui(),
  ],
};

export default config;

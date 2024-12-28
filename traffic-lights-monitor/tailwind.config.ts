import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/interfaces/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      borderSpacing: {
        'road': '16px'
      },
      backgroundImage: {
        'dashed-white': 'repeating-linear-gradient(90deg, white 0 12px, transparent 12px 32px)',
        'dashed-white-vertical': 'repeating-linear-gradient(0deg, white 0 12px, transparent 12px 32px)',
      }
    },
  },
  plugins: [],
} satisfies Config;

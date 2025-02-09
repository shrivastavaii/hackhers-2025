import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkTeal: "#254642",
        midTeal: "#316D60",
        lightTeal: "#5E7371",  
        offWhite: "#AACBC8",
        neonGreen: "#75fb4b",
        darkGreen: "#1b1b1b"
      },
      fontFamily: {
        sans: ["'Actor'", "sans-serif"], // Make Actor the default sans font
        mono: ["var(--font-geist-mono)", "monospace"],
        inter: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      backgroundImage: {
        'green-background': "./background.png",
      },
    },
  },
  plugins: [],
} satisfies Config;

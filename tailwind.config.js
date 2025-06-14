/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        larry: ["Larry-Regular", "sans-serif"],
        "larry-medium": ["Larry-Medium", "sans-serif"],
        "larry-semibold": ["Larry-SemiBold", "sans-serif"],
        "larry-bold": ["Larry-Bold", "sans-serif"],
        "larry-extrabold": ["Larry-ExtraBold", "sans-serif"],
        syne: ["Syne-Regular", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
    },
  },
  plugins: [],
};

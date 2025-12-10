/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        background: "#EEECF3",
        primary: "#0EB8F0",
        secondary: "#6366F1",
        text: "#1a1a1a",
        subtext: "#6B7280",
        accent: "#0ea5e9",
        cardbg: "#FBFBFB",
        border: "#dddddd",

        // Dark equivalents (used via `dark:`)
        darkBackground: "#1A1A1A",
        darkPrimary: "#FFFFFF", 
        darkSecondary: "#818CF8",
        darkText: "#F5F5F5",
        darkSubtext: "#9CA3AF",
        darkAccent: "#8B0000",
        darkCardbg: "#222222",
        darkBorder: "#333333",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}


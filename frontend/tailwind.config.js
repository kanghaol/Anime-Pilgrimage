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
        background: "#F9FAFB",
        primary: "#0EB8F0",
        secondary: "#6366F1",
        text: "#111827",
        subtext: "#6B7280",
        accent: "#F59E0B",
        border: "#E5E7EB",

        // Dark equivalents (used via `dark:`)
        darkBackground: "#17181A",
        darkPrimary: "#FFFFFF", 
        darkSecondary: "#818CF8",
        darkText: "#F9FAFB",
        darkSubtext: "#9CA3AF",
        darkAccent: "#FACC15",
        darkBorder: "#1E293B",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}


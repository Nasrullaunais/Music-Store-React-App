import {heroui} from "@heroui/theme"
import {purple} from "@heroui/theme/dist/colors/purple.js"
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/switch/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/input/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/button/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/avatar/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/badge/dist/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/card/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui(
      {
          defaultTheme: "light",
          themes: {
              light: {
                  colors: {
                      default: "#6b7280",        // Gray for secondary elements
                      primary: "#6f63f1",        // Indigo-500 - main brand color
                      secondary: "#a855f7",      // Purple-500 - accent color
                      accent: "#8b5cf6",         // Violet-500 - highlights
                      neutral: "#374151",        // Gray-700 - text
                      "base-100": "#ffffff",     // White background
                      "base-200": "#f8fafc",     // Slate-50 - subtle bg
                      "base-300": "#e2e8f0",     // Slate-200 - borders
                      "base-content": "#1e293b", // Slate-800 - main text
                      info: "#3b82f6",           // Blue-500
                      success: "#10b981",        // Emerald-500
                      warning: "#f59e0b",        // Amber-500
                      error: "#ef4444",

                      lol: {
                          50: "#f5f3ff",
                          100: "#ece9fe",
                          200: "#dbd6fe",
                          300: "#c4b5fd",
                          400: "#9d8bfa",
                          500: "#735cf6",
                          600: "#6a3aed",
                          700: "#6028d9",
                          800: "#4e21b6",
                          900: "#431d95",
                          950: "#2f0a6b",
                      }// Red-500

                  },
                  layout: {
                      hoverOpacity: 0.8,
                  }
              },
              dark: {
                  colors: {
                      default: "#6b7280",        // Gray-500
                      primary: "#8f81f8",        // Indigo-400 - lighter for dark mode
                      secondary: "#a484fc",      // Purple-400
                      accent: "#a78bfa",         // Violet-400
                      neutral: "#9ca3af",        // Gray-400
                      "base-100": "#0f172a",     // Slate-900 - dark background
                      "base-200": "#1e293b",     // Slate-800
                      "base-300": "#334155",     // Slate-700
                      "base-content": "#f1f5f9", // Slate-100 - light text
                      info: "#60a5fa",           // Blue-400
                      success: "#34d399",        // Emerald-400
                      warning: "#fbbf24",        // Amber-400
                      error: "#f87171",          // Red-400
                  },
                  layout: {
                      hoverOpacity: 0.9,
                  }
              }
          }

      }
  )],
}

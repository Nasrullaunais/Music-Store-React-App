import {heroui} from "@heroui/theme"

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
  plugins: [heroui({
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
          error: "#ef4444",          // Red-500
        },
      },
      dark: {
        colors: {
          default: "#4b5563",        // Gray-600 for dark mode
          primary: "#8b5cf6",        // Violet-500 - main brand color
          secondary: "#c084fc",      // Purple-400 - accent color
          accent: "#a78bfa",         // Violet-400 - highlights
          neutral: "#d1d5db",        // Gray-300 - text
          "base-100": "#111827",     // Gray-900 background
          "base-200": "#1f2937",     // Gray-800 - subtle bg
          "base-300": "#374151",     // Gray-700 - borders
          "base-content": "#f3f4f6", // Gray-100 - main text
          info: "#60a5fa",           // Blue-400
          success: "#34d399",        // Emerald-400
          warning: "#fbbf24",        // Amber-400
          error: "#f87171",          // Red-400
        },
      },
    },
  })],
}

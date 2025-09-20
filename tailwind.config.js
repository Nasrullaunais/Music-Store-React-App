import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
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
                      default: "#7451ef",
                      primary: "#856be1",
                      secondary: "#ccbffb",
                      accent: "#4e23ff",
                      neutral: "#374151",
                      "base-100": "#ffffff",
                      "base-200": "#f9fafb",
                      "base-300": "#d1d5db",
                      "base-content": "#1f2937",
                      info: "#410fd8",
                      success: "#16a34a",
                      warning: "#f59e0b",
                      error: "#dc2626",
                  },
                  layout: {
                      hoverOpacity: "0.8",
                  }
              },
              dark: {
                  colors: {
                      primary: "#6143d3",
                      secondary: "#655a81",
                      accent: "#391d95",
                      neutral: "#374151",
                      "base-100": "#ffffff",
                      "base-200": "#f9fafb",
                      "base-300": "#d1d5db",
                      "base-content": "#1f2937",
                      info: "#410fd8",
                      success: "#16a34a",
                  },
                  layout: {
                      hoverOpacity: "0.9",
                  }

              }
          }

      }
  )],
}

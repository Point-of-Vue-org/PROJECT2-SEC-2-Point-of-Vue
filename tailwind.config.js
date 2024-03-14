import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'cardshadow': '4px 6px 5.5px 0px rgba(0,0,0,0.25)',
      }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#ff5500",
          secondary: "#666666",
          accent: "#a8a29e",
          neutral: "#44403c",
          "base-100": "#292524",
          info: "#60a5fa",
          success: "#16a34a",
          warning: "#facc15",
          error: "#ef4444"
        }
      }
    ]
  },
  safelist: [
    'alert-success',
    'alert-error'
  ],
  plugins: [daisyui]
}

import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'postcard': '4px 6px 5.5px 0px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        'helvetica': 'Helvetica, sans-serif',
      },
      screens: {
        'xs': '321px',
        // 'xl': '1080px',
        '1-5xl':'1408px',
      },
    }
  },
  daisyui: {
    themes: [
      {
        plannet: {
          primary: "#f50",
          secondary: "#9e9c9b",
          accent: "#a8a29e",
          neutral: "#3c3533",
          "base-100": "#292524",
          info: "#60a5fa",
          success: "#16a34a",
          warning: "#facc15",
          error: "#ef4444",
        }
      }
    ]
  },
  safelist: [
    'alert-success',
    'alert-error',
    'alert-warning'
  ],
  plugins: [daisyui]
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary
        tomato: "#F35B2D",
        olive:  "#405B2E",
        cream:  "#FFF8EF",
        butter: "#F6E6A9",
        ocean:  "#4F8DCB",
        // Brand secondary
        coral:  "#FF8A7A",
        golden: "#FFC84D",
        palm:   "#698C46",
        sand:   "#F2D7C6",
        cocoa:  "#7C4C34",
      },
      fontFamily: {
        display: ["Young Serif", "serif"],
        sans:    ["Instrument Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}

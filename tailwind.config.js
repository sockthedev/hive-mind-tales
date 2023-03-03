/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inherit: "inherit",
      },
      gridTemplateRows: {
        layout: "auto 1fr auto",
      },
      maxWidth: {
        "8xl": "92rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',
        card: '#1c1c1c',
        primary: '#ff3b30',
        accent: '#ff5722',
        textMuted: '#aaaaaa'
      }
    },
  },
  plugins: [],
}
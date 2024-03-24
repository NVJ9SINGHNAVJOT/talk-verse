/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: '#root',
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1e3a5f',
        'success': '#22c55e',
        'danger': '#ef4444',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

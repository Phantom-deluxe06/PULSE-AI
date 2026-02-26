/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'primary-light': '#dbeafe',
        'slate-dark': '#1e293b',
        'success': '#16a34a',
        'warning': '#eab308',
        'danger': '#dc2626',
      }
    },
  },
  plugins: [],
}

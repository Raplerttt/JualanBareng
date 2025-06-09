/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#C2FFC7',
        'navbar' : '#80CBC4',
        'hero' : '#B4EBE6',
        'button' : '#FFB433'
      },
    },
  },
  plugins: [],
}
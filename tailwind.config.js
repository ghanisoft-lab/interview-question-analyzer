/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define Inter font
      },
      colors: {
        'primary-blue': '#2563EB', // A nice primary blue
        'secondary-white': '#F9FAFB', // Light gray for backgrounds
        'accent-teal': '#14B8A6', // Accent color
        'text-dark': '#1F2937', // Dark text color
        'text-light': '#4B5563', // Lighter text color
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    // Add paths to all of your template files here
  ],
  theme: {
    extend: {
        fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      
      colors : {
 'back-primary': '#F6F8F9',          "text-secondary": "#AA2B1D"
      }

    },
  },
  plugins: [],
};
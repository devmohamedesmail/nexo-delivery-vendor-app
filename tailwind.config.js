/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#fd4a12",   
          dark: "#fd4a12",      
        },
        background: {
          DEFAULT: "#F3F4F6", 
          dark: "#0D0D0D", 
        },
        text: {
          DEFAULT: "#1E293B", 
          dark: "#FFFFFF", 
        },
    },
  },
  plugins: [],
}
};
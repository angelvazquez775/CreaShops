// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",                      // Asegúrate de que este archivo esté incluido si existe
    "./src/**/*.{html,js,jsx,ts,tsx}",   // Rutas y extensiones correctas para tus archivos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

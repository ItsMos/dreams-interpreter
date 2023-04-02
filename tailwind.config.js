/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.vue"
  ],
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        write: {
          '0%, 100%': { transform: 'translateX(40px)' },
          '50%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        write: 'write 1.2s ease-in-out infinite'
      }
    }
  }
}

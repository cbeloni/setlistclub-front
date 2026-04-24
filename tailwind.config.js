/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50:  "#f0faf4",
          100: "#d6f5e3",
          200: "#aeebc8",
          300: "#75d9a3",
          400: "#3ec47c",
          500: "#1eaa60",
          600: "#158a4c",
          700: "#116e3d",
          800: "#0e5631",
          900: "#0a3d23",
          950: "#051f12",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(10, 61, 35, 0.18)",
        glow: "0 0 24px 0px rgba(30, 170, 96, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #051f12 0%, #0a3d23 40%, #0e5631 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(21,138,76,0.12) 0%, rgba(14,86,49,0.06) 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in": "slide-in 0.3s ease-out both",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

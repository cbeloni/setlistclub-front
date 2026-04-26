/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(15, 23, 42, 0.35)",
        glow: "0 8px 24px -16px rgba(37, 99, 235, 0.45)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #eef2ff 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.92) 100%)",
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

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        surfaceAlt: "#161616",
        primaryText: "#FFFFFF",
        secondaryText: "#A1A1AA",
        mutedText: "#71717A",
      },
      boxShadow: {
        glow: "0 0 36px rgba(59,130,246,0.14)",
        card: "0 24px 60px rgba(0,0,0,0.45)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s ease both",
        "fade-in": "fade-in 0.5s ease both"
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        primaryLight: "#3B82F6",

        appBg: "#F9FAFB",
        cardBg: "#FFFFFF",

        textPrimary: "#111827",
        textSecondary: "#6B7280",
        textMuted: "#9CA3AF",

        borderLight: "#E5E7EB",

        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },

      borderRadius: {
        xl: "16px",
        lg: "12px",
        md: "8px",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        soft: "0 2px 6px rgba(0, 0, 0, 0.04)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

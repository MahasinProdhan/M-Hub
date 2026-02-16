/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* Brand */
        primary: "#1E40AF", // blue-800
        primaryLight: "#3B82F6", // blue-500

        /* Backgrounds */
        appBg: "#F9FAFB", // gray-50
        cardBg: "#FFFFFF",

        /* Text */
        textPrimary: "#111827", // gray-900
        textSecondary: "#6B7280", // gray-500
        textMuted: "#9CA3AF", // gray-400

        /* Borders */
        borderLight: "#E5E7EB", // gray-200

        /* Accent */
        success: "#16A34A", // green-600
        warning: "#F59E0B", // amber-500
        danger: "#DC2626", // red-600
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

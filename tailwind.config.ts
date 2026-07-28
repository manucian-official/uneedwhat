import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#0F172A",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: {
        xl: "16px",
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

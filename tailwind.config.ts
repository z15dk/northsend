import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f5f1e8",
        ink: "#1c1a17",
        mist: "#dcd6c8",
        pine: "#20493f",
        cloud: "#fbfaf7",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 60px rgba(28, 26, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

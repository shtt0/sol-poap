import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "top-bg": "url('/images/top-bg.png')",
      },

      colors: {
        baseblack: "#001435",
        namiblue: "#ADD8E6",
        baseblue: "#F3F3F6",
        kumogray: "#1a1a1a",
      },
    },
  },
  plugins: [],
};
export default config;

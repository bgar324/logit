import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      caretShape: {
        block: 'block',
      },
      // textUnderlineOffset: {
      //   6: '4px',
      // },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "greenBg": "#D1FAE5",
        "baseBg": "#F5F5F5"
      },
    },
  },
  plugins: [],
} satisfies Config;

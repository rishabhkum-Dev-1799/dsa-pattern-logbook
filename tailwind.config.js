/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141210",
        paper: "#FFFDF7",
        grid: "#DCE4F2",
        gridline: "#C9D3E6",
        lime: "#B8F04B",
        sky: "#7FD1FF",
        blush: "#FF8FB3",
        amber: "#FFC13B",
        lilac: "#C4A5FF",
        mint: "#5EE6C1",
        coral: "#FF9E6B",
        periwinkle: "#9BB8FF",
        cream: "#FFF3D6",
        ice: "#EAF3FF",
        frost: "#C9E2FF",
      },
      fontFamily: {
        display: ["'Archivo Black'", "'Space Grotesk'", "sans-serif"],
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        nb: "6px 6px 0 #141210",
        "nb-sm": "4px 4px 0 #141210",
        "nb-xs": "2px 2px 0 #141210",
        none: "0 0 0 #141210",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};

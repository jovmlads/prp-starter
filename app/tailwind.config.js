/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        sidebar: "16rem",
        "sidebar-collapsed": "5rem",
      },
      transition: {
        sidebar: "width 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

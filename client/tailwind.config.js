import forms from "@tailwindcss/forms";
import rtl from "tailwindcss-rtl";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [forms, rtl],
};

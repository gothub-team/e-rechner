/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            montserrat: ['Montserrat', 'sans-serif'],
        },
    },
    plugins: ['prettier-plugin-tailwindcss'],
};

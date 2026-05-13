/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brandGold: '#D4AF37',
                brandDark: '#1A1A1A',
                brandAccent: '#E91E63', // For "Fat to Slim" vibrancy
            },
        },
    },
    plugins: [],
}
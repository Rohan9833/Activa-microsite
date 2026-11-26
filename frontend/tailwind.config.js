/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#071B4B', 700: '#0B2463', 500: '#3A4A73', 300: '#6B7799' },
        brand: { blue: '#0866F5', violet: '#7434F5', magenta: '#DD10E8' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(100deg, #0866F5 0%, #7434F5 52%, #DD10E8 100%)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,27,75,0.04), 0 8px 24px -8px rgba(7,27,75,0.10)',
        'card-hover': '0 2px 4px rgba(7,27,75,0.05), 0 18px 40px -12px rgba(116,52,245,0.25)',
        glow: '0 10px 30px -8px rgba(116,52,245,0.45)',
      },
      borderRadius: { '4xl': '2rem' },
      maxWidth: { site: '1280px' },
    },
  },
  plugins: [],
};

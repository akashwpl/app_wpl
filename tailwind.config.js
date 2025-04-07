const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gridular: ["Gridular", "sans-serif"],
        bienvenue: ["Bienvenue", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        bevan: ["Bevan", "sans-serif"]
      },
      colors: {
        primaryBlue: "#16237F",
        primaryBlack: "#000000",
        primaryYellow: "#FBF1B8",
        primaryGreen: "#9FE7C7",
        primaryRed: "#E38070",
        primaryDarkUI: "#06105D",
        cardPurpleText: "#97A0F1",
        cardPurpleBg: "#97A0F21A",
        cardBlueText: "#3EACDB",
        cardBlueBg: "#9CD4EC1A",
        cardBlueBg2: "#171F5E",
        cardGithubBlueBg: '#091044',
        cardGreenText: "#0ED065",
        cardGreenBg: "#0ED0651A",
        cardRedText: "#F03D3D",
        cardRedBg: "#F03D3D1A",
        cardYellowText: "#FCBF04",
        cardYellowBg: "#FCBF041A",
        cardOnlyDustBg: "#010116B2",
        white32: "#FFFFFF52",
        white88: "#FFFFFFE0",
        white48: "#FFFFFF7A",
        white7: "#FFFFFF12",
        white64: "#FFFFFFA3",
        white4: "#FFFFFF0A",
        white12: "#FFFFFF1F",
        black7: "#00000012",
        errorMsgRedText: "#FF7373"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        'rotate-shimmer': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'step-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(190deg)' },
          '50%': { transform: 'rotate(170deg)' },
          '75%': { transform: 'rotate(185deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        'step-rotate-back': {
          '0%': { transform: 'rotate(180deg)' },
          '25%': { transform: 'rotate(195deg)' },
          '50%': { transform: 'rotate(170deg)' },
          '75%': { transform: 'rotate(185deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },

        menuSlideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '50%': { transform: 'translateX(-10%)', opacity: '1' },
          '100%': { transform: 'translateX(0)' },
        },
        menuSlideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '50%': { transform: 'translateX(-10%)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        bounce: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5px)' },
        },
        'spin-alternate-180': {
          '0%, 100%': { transform: 'rotate(0deg)' },  
          '50%': { transform: 'rotate(180deg)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'rotate-shimmer': 'rotate-shimmer 2s linear infinite',
        'step-rotate': 'step-rotate 0.6s ease-in-out forwards',
        'step-rotate-back': 'step-rotate-back 0.3s ease-in-out forwards',

        'menu-slide-in': 'menuSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'menu-slide-out': 'menuSlideOut 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'hovered': 'bounce 0.5s ease-in-out forwards',

        'spin-alt-180': 'spin-alternate-180 3s linear infinite',
      },
    },
  },
  plugins: [
    addVariablesForColors
  ],
}

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}


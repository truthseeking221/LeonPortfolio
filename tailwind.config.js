/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(0, 74, 173)",
        orange: "rgb(228, 70, 25)",
        secondary: "rgb(246, 244, 240)",
        light: "rgb(255, 255, 255)",
        "border-1": "rgb(221, 227, 233)",
        "border-2": "rgb(204, 219, 239)",
        "border-3": "rgb(178, 201, 230)",
        placeholder: "rgb(153, 153, 153)",
        link: "rgb(0, 153, 255)",
      },
      fontFamily: {
        coconat: ["CoconatLocal", "sans-serif"],
        inter: ["Inter", "Inter Placeholder", "sans-serif"],
        instrument: ["Instrument Serif", "Instrument Serif Placeholder", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        h2: ["40px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        "h2-tablet": ["32px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        "h2-phone": ["26px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        h3: ["32px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        "h3-tablet": ["28px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        "h3-phone": ["22px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        h4: ["24px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        "h4-phone": ["20px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        h5: ["20px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        "h5-phone": ["18px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        body: ["16px", { lineHeight: "160%", letterSpacing: "-0.04em" }],
        sm: ["14px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        brand: ["21px", { letterSpacing: "-0.04em" }],
        logo: ["48px", { letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        pill: "32px",
      },
      screens: {
        phone: { max: "809px" },
        tablet: "810px",
        desktop: "1200px",
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        tight: "-0.04em",
      },
    },
  },
  plugins: [],
}

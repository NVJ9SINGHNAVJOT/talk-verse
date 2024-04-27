/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/index.css",
    "./src/**/*.{js,ts,jsx,tsx}",
    // flowbite-ui
    "node_modules/flowbite-react/lib/esm/**/*.js",
    // flowbite-ui
  ],
  corePlugins: {},
  theme: {
    // shadcn-ui
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // shadcn-ui
    screens: {
      sm: "640px",
      md: "768px",
      lm: "900px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        green: "#25b510",
        whitesmoke: "#d3d3d3",
        grayblack: "#212121",
        white: "#fff",
        black: "#000",
        transparent: "#ffffff00",
        somke: "rgb(231, 231, 231)",
        richblack: {
          5: "#F1F2FF",
          25: "#DBDDEA",
          50: "#C5C7D4",
          100: "#AFB2BF",
          200: "#999DAA",
          300: "#838894",
          400: "#6E727F",
          500: "#585D69",
          600: "#424854",
          700: "#2C333F",
          800: "#161D29",
          900: "#000814",
        },
        richblue: {
          5: "#ECF5FF",
          25: "#C6D6E1",
          50: "#A0B7C3",
          100: "#7A98A6",
          200: "#537988",
          300: "#2D5A6A",
          400: "#073B4C",
          500: "#063544",
          600: "#042E3B",
          700: "#032833",
          800: "#01212A",
          900: "#001B22",
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        snow: {
          50: "#fefefe",
          100: "#f9f9f9",
          200: "#f4f4f4",
          300: "#eeeeee",
          400: "#e5e5e5",
          500: "#e0e0e0",
          600: "#d6d6d6",
          700: "#c0c0c0",
          800: "#aaaaaa",
          900: "#999999",
          950: "#777777",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#475569",
          700: "#374151",
          800: "#1e293b",
          900: "#111827",
          950: "#1a202c",
        },
        // shadcn-ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // shadcn-ui
      },
      maxWidth: {
        maxContent: "1600px",
      },
      minWidth: {
        minContent: "640px",
      },
      fontFamily: {
        "be-veitnam-pro": '"Be Vietnam Pro", sans-serif',
        "roboto-condensed": '"Roboto Condensed", sans-serif',
      },
      // shadcn-ui
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      // shadcn-ui
    },
  },
  plugins: [import("flowbite/plugin"), import("tailwindcss-animate")],
};

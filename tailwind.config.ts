import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        // Professional monochromatic palette
        gray: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
        // Minimal accent - just one subtle color for tiny highlights
        accent: {
          DEFAULT: "#ffffff",
          muted: "#a3a3a3",
          subtle: "#e5e7eb", // Very subtle accent
        },
      },
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "text-reveal": {
          "0%": {
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          },
          "100%": {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          },
        },
        "magnetic-hover": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(2px, -2px) rotate(1deg)" },
          "50%": { transform: "translate(-1px, -3px) rotate(-0.5deg)" },
          "75%": { transform: "translate(3px, -1px) rotate(0.5deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
        "subtle-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 255, 255, 0.15)" },
        },
        "logo-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          },
          "50%": {
            transform: "scale(1.05)",
            filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "border-dance": {
          "0%": {
            borderColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.1)",
          },
          "50%": {
            borderColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "0 0 20px 0 rgba(255, 255, 255, 0.1)",
          },
          "100%": {
            borderColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 0 0 0 rgba(255, 255, 255, 0.1)",
          },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        "scanline-move": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
        "scanline-horizontal": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 0%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "slide-in-left": "slide-in-left 0.8s ease-out forwards",
        "slide-in-right": "slide-in-right 0.8s ease-out forwards",
        "text-reveal": "text-reveal 1.2s ease-out forwards",
        "magnetic-hover": "magnetic-hover 0.3s ease-in-out",
        "subtle-glow": "subtle-glow 3s ease-in-out infinite",
        "logo-pulse": "logo-pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "scale-pulse": "scale-pulse 2s ease-in-out infinite",
        "border-dance": "border-dance 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "scanline-move": "scanline-move 15s linear infinite",
        "scanline-horizontal": "scanline-horizontal 25s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

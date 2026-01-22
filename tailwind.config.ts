// tailwind.config.ts
import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#1e1e2e",
            foreground: "#000000",
            focus: "#89b4fa",
            overlay: "#ffffff",
            default: {
              50: "#fafafa", 100: "#f2f2f3", 200: "#ebebec", 300: "#e3e3e6", 400: "#dcdcdf",
              500: "#d4d4d8", 600: "#afafb2", 700: "#8a8a8c", 800: "#656567", 900: "#404041",
              foreground: "#000", DEFAULT: "#d4d4d8",
            },
            primary: {
              50: "#f9f4fe", 100: "#efe4fd", 200: "#e6d5fb", 300: "#ddc5fa", 400: "#d4b6f8",
              500: "#cba6f7", 600: "#a789cc", 700: "#846ca1", 800: "#604f75", 900: "#3d324a",
              foreground: "#000", DEFAULT: "#cba6f7",
            },
            secondary: {
              50: "#f6f7ff", 100: "#e9ecff", 200: "#dbe0ff", 300: "#ced5fe", 400: "#c1c9fe",
              500: "#b4befe", 600: "#959dd2", 700: "#757ca5", 800: "#565a79", 900: "#36394c",
              foreground: "#000", DEFAULT: "#b4befe",
            },
            success: {
              50: "#f4fcf3", 100: "#e4f7e3", 200: "#d5f2d2", 300: "#c5edc2", 400: "#b6e8b1",
              500: "#a6e3a1", 600: "#89bb85", 700: "#6c9469", 800: "#4f6c4c", 900: "#324430",
              foreground: "#000", DEFAULT: "#a6e3a1",
            },
            warning: {
              50: "#fefbf5", 100: "#fdf6e7", 200: "#fcf1d9", 300: "#fbeccb", 400: "#fae7bd",
              500: "#f9e2af", 600: "#cdba90", 700: "#a29372", 800: "#766b53", 900: "#4b4435",
              foreground: "#000", DEFAULT: "#f9e2af",
            },
            danger: {
              50: "#fef1f4", 100: "#fbdce5", 200: "#f9c8d6", 300: "#f7b4c6", 400: "#f59fb7",
              500: "#f38ba8", 600: "#c8738b", 700: "#9e5a6d", 800: "#734250", 900: "#492a32",
              foreground: "#000", DEFAULT: "#f38ba8",
            },
            content1: { DEFAULT: "#ffffff", foreground: "#000" },
            content2: { DEFAULT: "#f4f4f5", foreground: "#000" },
            content3: { DEFAULT: "#e4e4e7", foreground: "#000" },
            content4: { DEFAULT: "#d4d4d8", foreground: "#000" },
          },
        },
        dark: {
          colors: {
            background: "#1e1e2e",
            foreground: "#cdd6f4",
            focus: "#89b4fa",
            overlay: "#6c7086",
            default: {
              50: "#0d0d0e", 100: "#19191c", 200: "#26262a", 300: "#323238", 400: "#3f3f46",
              500: "#65656b", 600: "#8c8c90", 700: "#b2b2b5", 800: "#d9d9da", 900: "#ffffff",
              foreground: "#fff", DEFAULT: "#3f3f46",
            },
            primary: {
              50: "#3d324a", 100: "#604f75", 200: "#846ca1", 300: "#a789cc", 400: "#cba6f7",
              500: "#d4b6f8", 600: "#ddc5fa", 700: "#e6d5fb", 800: "#efe4fd", 900: "#f9f4fe",
              foreground: "#000", DEFAULT: "#cba6f7",
            },
            secondary: {
              50: "#36394c", 100: "#565a79", 200: "#757ca5", 300: "#959dd2", 400: "#b4befe",
              500: "#c1c9fe", 600: "#ced5fe", 700: "#dbe0ff", 800: "#e9ecff", 900: "#f6f7ff",
              foreground: "#000", DEFAULT: "#b4befe",
            },
            success: {
              50: "#324430", 100: "#4f6c4c", 200: "#6c9469", 300: "#89bb85", 400: "#a6e3a1",
              500: "#b6e8b1", 600: "#c5edc2", 700: "#d5f2d2", 800: "#e4f7e3", 900: "#f4fcf3",
              foreground: "#000", DEFAULT: "#a6e3a1",
            },
            warning: {
              50: "#4b4435", 100: "#766b53", 200: "#a29372", 300: "#cdba90", 400: "#f9e2af",
              500: "#fae7bd", 600: "#fbeccb", 700: "#fcf1d9", 800: "#fdf6e7", 900: "#fefbf5",
              foreground: "#000", DEFAULT: "#f9e2af",
            },
            danger: {
              50: "#492a32", 100: "#734250", 200: "#9e5a6d", 300: "#c8738b", 400: "#f38ba8",
              500: "#f59fb7", 600: "#f7b4c6", 700: "#f9c8d6", 800: "#fbdce5", 900: "#fef1f4",
              foreground: "#000", DEFAULT: "#f38ba8",
            },
            content1: { DEFAULT: "#313244", foreground: "#fff" },
            content2: { DEFAULT: "#45475a", foreground: "#fff" },
            content3: { DEFAULT: "#3f3f46", foreground: "#fff" },
            content4: { DEFAULT: "#7f849c", foreground: "#000" },
          },
        },
      },
      layout: {
        disabledOpacity: "0.5",
      },
    }),
  ],
};

export default config;

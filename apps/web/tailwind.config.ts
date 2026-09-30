import type { Config } from "tailwindcss";

const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"], theme: { extend: { colors: { paper: "#f7f7f5", ink: "#171917", muted: "#747873", line: "#e4e6e1", moss: "#526b58" }, fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] } } }, plugins: [] };
export default config;

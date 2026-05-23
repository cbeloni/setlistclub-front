import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: true
  },
  preview: {
    port: 3000,
    allowedHosts: true
  },
  // fallback seguro para evitar bloqueios por host em proxies/reverse-proxy
  // quando houver variação de host header no ambiente
  clearScreen: false
});

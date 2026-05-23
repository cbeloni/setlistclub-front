import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    allowedHosts: [
      "setlistclub.beloni.dev.br",
      "setlistclub-front.beloni.dev.br",
      "localhost",
      "127.0.0.1"
    ]
  },
  preview: {
    port: 3000,
    allowedHosts: [
      "setlistclub.beloni.dev.br",
      "setlistclub-front.beloni.dev.br",
      "localhost",
      "127.0.0.1"
    ]
  },
  // fallback seguro para evitar bloqueios por host em proxies/reverse-proxy
  // quando houver variação de host header no ambiente
  clearScreen: false
});

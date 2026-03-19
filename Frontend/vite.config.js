import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 5173,
    proxy: {                                    // ADDED: proxy block
      "/api": {                                 // any request to /api/*
        target: "http://localhost:8080",        // gets forwarded to Spring Boot
        changeOrigin: true,                     // fixes host header mismatch
        secure: false,                          // allows http (not https) in dev
      },
    },
  },
});
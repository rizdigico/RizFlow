import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api/demo/chat": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/api/ai-score": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
      "/api/lead-capture": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            )
              return "vendor";
            if (id.includes("@headlessui") || id.includes("@heroicons"))
              return "ui";
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            )
              return "forms";
          }
        },
      },
    },
  },
});

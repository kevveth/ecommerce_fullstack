import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Explicitly set the client port
    proxy: {
      // All API requests are proxied to the backend server
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keep the path as is
      },
    },
  },
  build: {
    commonjsOptions: {
      // This helps with handling CommonJS dependencies
      transformMixedEsModules: true,
    },
  },
});

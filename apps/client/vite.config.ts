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
        target: "http://localhost:3001", // Updated to match your server port
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Keep the path as is
      },
    },
  },
  resolve: {
    alias: {
      // Add path alias for the shared package
      "@ecommerce/shared": resolve(__dirname, "../../packages/shared/src"),
    },
  },
  build: {
    commonjsOptions: {
      // This helps with handling CommonJS dependencies
      transformMixedEsModules: true,
    },
  },
});

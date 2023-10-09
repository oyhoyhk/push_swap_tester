import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/static/",
  publicDir: "/public/",
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(
      process.env.VITE_API_URL_DEV
    ),
  },
});

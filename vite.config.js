import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import string from "vite-plugin-string";

export default defineConfig({
  plugins: [vue(), string({ include: "**/*.svg" })],
  base: '/',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    define: {
    '__VUE_OPTIONS_API__': false,
  }
  }
});

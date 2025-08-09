// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  modules: ["@nuxt/ui", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    databaseUrl:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/bulletin_board",
  },

  typescript: {
    typeCheck: false,
  },

  nitro: {
    experimental: {
      wasm: true,
    },
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",
});

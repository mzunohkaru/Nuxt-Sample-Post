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

  // Difyチャットボット用の設定
  app: {
    head: {
      script: [
        // Difyチャットボットの設定
        {
          innerHTML: `
            window.difyChatbotConfig = {
              token: '3NjCxsT5zqPxYV16',
              inputs: {
                // Start nodeからの入力をここで定義できます
                // キーは変数名
                // 例: name: "NAME"
              },
              systemVariables: {
                // user_id: 'ここでユーザーIDを定義できます',
                // conversation_id: 'ここで会話IDを定義できます（有効なUUIDである必要があります）',
              },
              userVariables: {
                // avatar_url: 'ここでユーザーアバターURLを定義できます',
                // name: 'ここでユーザー名を定義できます',
              },
            };
          `,
          type: "text/javascript",
        },
        // Difyチャットボットスクリプトの読み込み
        {
          src: "https://udify.app/embed.min.js",
          id: "3NjCxsT5zqPxYV16",
          defer: true,
        },
      ],
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",
});

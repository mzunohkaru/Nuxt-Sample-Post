import { defineNuxtPlugin } from "#app";
import { store } from "../store";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(store);

  // クライアントサイドでのみ認証状態を初期化
  if (process.client) {
    await store.dispatch("initAuth");
  }

  // ストアをNuxtのコンテキストで利用可能にする（オプション）
  return {
    provide: {
      store,
    },
  };
});

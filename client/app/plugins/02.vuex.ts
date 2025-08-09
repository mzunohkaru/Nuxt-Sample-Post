import { defineNuxtPlugin } from "#app";
import { store } from "~/store";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(store);

  if (import.meta.client) {
    await store.dispatch("initAuth");
  }

  return {
    provide: {
      store,
    },
  };
});

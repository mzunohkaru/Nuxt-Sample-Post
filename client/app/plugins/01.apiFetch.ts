import { defineNuxtPlugin } from "#app";
import { store } from "~/store";

export default defineNuxtPlugin((nuxtApp) => {
  const { $fetch } = nuxtApp;

  // $fetchが利用可能かチェック
  if (!$fetch || typeof $fetch.create !== "function") {
    console.warn("$fetch is not available in plugin, skipping apiFetch setup");
    return;
  }

  const originalFetch = $fetch;

  // カスタマイズされた$fetchインスタンスを作成
  const customFetch = $fetch.create({
    onRequest({ _, options }: { _: any; options: any }) {
      // 認証トークンをヘッダーに追加
      if (store.getters.isAuthenticated && store.getters.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${store.getters.accessToken}`,
        };
      }
    },

    async onResponseError({
      request,
      response,
      options,
    }: {
      request: any;
      response: any;
      options: any;
    }) {
      if (response.status === 401) {
        if (request.toString().includes("/api/auth/refresh")) {
          return; // 無限ループを回避
        }

        try {
          const newAccessToken = await store.dispatch("refreshToken");

          if (newAccessToken) {
            // 新しいトークンで元のリクエストを再試行
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            return originalFetch(request, options);
          } else {
            // リフレッシュ失敗時はログアウト
            await store.dispatch("logout");
            if (import.meta.client) {
              await navigateTo("/login");
            }
          }
        } catch (e) {
          console.error("Error during token refresh or retry:", e);
          await store.dispatch("logout");
          if (import.meta.client) {
            await navigateTo("/login");
          }
        }
      }
    },
  });

  // カスタマイズされたfetchをグローバルに設定
  globalThis.$fetch = customFetch;

  // Provide the original fetch if needed elsewhere, though not recommended
  nuxtApp.provide("originalFetch", originalFetch);
});

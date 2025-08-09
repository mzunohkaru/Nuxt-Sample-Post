import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { store } from "~/store";

// 認証が必要なルート
const protectedRoutes = ["/", "/account"];
// 認証済みユーザーがアクセスすべきでないルート
const publicOnlyRoutes = ["/login"];

// 状態が確定するまで待機するヘルパー
function waitForAuthReady() {
  return new Promise<void>((resolve) => {
    if (store.state.authReady) {
      return resolve();
    }
    const unsubscribe = store.subscribe((mutation: any) => {
      if (mutation.type === "setAuthReady" && mutation.payload) {
        unsubscribe();
        resolve();
      }
    });
  });
}

export default defineNuxtRouteMiddleware(async (to) => {
  // クライアントサイドでのみ実行
  if (import.meta.server) {
    return;
  }

  // 認証状態の初期化が完了するまで待機
  await waitForAuthReady();

  const isAuthenticated = store.getters.isAuthenticated;

  // 保護されたルートへのアクセスチェック
  if (protectedRoutes.includes(to.path) && !isAuthenticated) {
    // ユーザーが認証されておらず、保護されたルートにアクセスしようとした場合
    // ログインページにリダイレクト
    return navigateTo("/login", { replace: true });
  }

  // 公開ルートへのアクセスチェック
  if (publicOnlyRoutes.includes(to.path) && isAuthenticated) {
    // ユーザーが認証されており、ログイン/登録ページにアクセスしようとした場合
    // ホームページにリダイレクト
    return navigateTo("/", { replace: true });
  }
});

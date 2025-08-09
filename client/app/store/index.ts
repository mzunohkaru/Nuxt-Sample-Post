// @ts-nocheck
import { createStore } from "vuex";
// @ts-ignore
import type { User } from "~/types";
import { ofetch } from "ofetch";

export interface RootState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isRefreshing: boolean; // トークンリフレッシュ中の状態
  authReady: boolean; // 認証初期化完了フラグ
}

// localStorageからアクセストークンを取得
const getStoredToken = (): string | null => {
  if (import.meta.client) {
    try {
      return localStorage.getItem("accessToken");
    } catch (e) {
      console.warn("Failed to get stored token:", e);
      return null;
    }
  }
  return null;
};

// localStorageにアクセストークンを保存
const setStoredToken = (token: string | null): void => {
  if (import.meta.client) {
    try {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    } catch (e) {
      console.warn("Failed to store token:", e);
    }
  }
};

// Vuexストアを作成
export const store = createStore<RootState>({
  state: (): RootState => ({
    accessToken: getStoredToken(), // 初期化時にlocalStorageから復元
    user: null,
    isAuthenticated: !!getStoredToken(), // トークンの存在で初期認証状態を決定
    isRefreshing: false,
    authReady: false,
  }),

  mutations: {
    setToken(state: RootState, accessToken: string | null) {
      // nullを許容
      state.accessToken = accessToken;
      state.isAuthenticated = !!accessToken;
      // localStorageにも保存
      setStoredToken(accessToken);
    },
    setRefreshing(state: RootState, isRefreshing: boolean) {
      state.isRefreshing = isRefreshing;
    },
    setAuthReady(state: RootState, isReady: boolean) {
      state.authReady = isReady;
    },
    setUser(state: RootState, user: User) {
      state.user = user;
    },
    clearAuth(state: RootState) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      // localStorageからも削除
      setStoredToken(null);
    },
  },

  actions: {
    // ログインアクション
    async login(
      { commit }: { commit: any },
      { username, password }: { username: string; password: string },
    ) {
      // インターセプターをバイパスするため、ofetchを直接使用
      const { data } = await ofetch("/api/auth/login", {
        method: "POST",
        body: { username, password },
      });

      if (data) {
        commit("setToken", data.accessToken);
        commit("setUser", data.user);
      }
    },

    // ログアウトアクション
    async logout({ commit }: { commit: any }) {
      try {
        // サーバー側のログアウトAPIを呼び出してリフレッシュトークンクッキーを削除
        await ofetch("/api/auth/logout", {
          method: "POST",
        });
      } catch (error) {
        // サーバー側のログアウトが失敗してもクライアント側の処理は実行する
        console.warn("Server logout failed:", error);
      } finally {
        // クライアント側の認証情報をクリア
        commit("clearAuth");
      }
    },

    // ユーザー情報更新アクション
    async updateUser(
      { commit }: { commit: any },
      { newUsername, newEmail }: { newUsername: string; newEmail: string },
    ) {
      const { success, user, error } = await ofetch("/api/account", {
        method: "PUT",
        body: { username: newUsername, email: newEmail },
      });

      if (success && user) {
        commit("setUser", user);
        return { success: true };
      } else {
        throw new Error(error || "更新に失敗しました");
      }
    },

    // ユーザー情報を取得するアクション
    async fetchUser({ commit, state }: { commit: any; state: RootState }) {
      try {
        const headers: Record<string, string> = {};
        if (state.accessToken) {
          headers.Authorization = `Bearer ${state.accessToken}`;
        }

        const { data } = await ofetch("/api/auth/me", {
          headers,
        });
        if (data && data.user) {
          commit("setUser", data.user);
          return true; // 成功を示す
        }
        return false;
      } catch (error) {
        commit("clearAuth");
        console.error("Failed to fetch user", error);
        return false;
      }
    },

    // トークンをリフレッシュするアクション
    async refreshToken({ commit, state }: { commit: any; state: RootState }) {
      if (state.isRefreshing) {
        // 既にリフレッシュ中の場合は待機
        return new Promise((resolve) => {
          const unsubscribe = store.subscribe((mutation: any, state: any) => {
            if (mutation.type === "setRefreshing" && !state.isRefreshing) {
              unsubscribe();
              resolve(state.accessToken);
            }
          });
        });
      }

      commit("setRefreshing", true);

      try {
        const response = await ofetch<{ accessToken: string }>(
          "/api/auth/refresh",
          {
            method: "POST",
          },
        );

        if (response.accessToken) {
          commit("setToken", response.accessToken);
          return response.accessToken;
        }
        // トークンが取得できなかった場合はログアウト
        throw new Error("New access token not received");
      } catch (error) {
        // リフレッシュに失敗した場合はログアウト
        commit("clearAuth");
        console.error("Failed to refresh token", error);
        return null;
      } finally {
        commit("setRefreshing", false);
      }
    },

    // アプリケーション初期化時の認証状態確認アクション
    async initAuth({
      commit,
      dispatch,
      state,
    }: {
      commit: any;
      dispatch: any;
      state: RootState;
    }) {
      if (import.meta.server) return; // サーバーサイドでは実行しない

      try {
        // localStorageからトークンが復元されている場合
        if (state.accessToken) {
          // ユーザー情報を取得してトークンの有効性を確認
          const userFetched = await dispatch("fetchUser");

          if (!userFetched) {
            // トークンが無効な場合、リフレッシュを試行
            console.log("Access token invalid, trying to refresh...");
            const newToken = await dispatch("refreshToken");

            if (newToken) {
              // リフレッシュ成功後、ユーザー情報を再取得
              await dispatch("fetchUser");
            }
          }
        } else {
          // トークンがない場合、リフレッシュを試行（リフレッシュトークンがある可能性）
          console.log("No access token found, trying to refresh...");
          const newToken = await dispatch("refreshToken");

          if (newToken) {
            // リフレッシュ成功後、ユーザー情報を取得
            await dispatch("fetchUser");
          }
        }
      } catch (e) {
        // 失敗してもエラーにはしない（単に未認証状態になるだけ）
        console.log("Authentication initialization failed:", e);
        commit("clearAuth");
      } finally {
        commit("setAuthReady", true);
      }
    },
  },

  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    currentUser: (state) => state.user,
    accessToken: (state) => state.accessToken,
  },
});

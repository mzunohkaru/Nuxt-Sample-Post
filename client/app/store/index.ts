import { createStore } from "vuex";
import type { User } from "~/types";
import { ofetch } from "ofetch";

export interface RootState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isRefreshing: boolean; // トークンリフレッシュ中の状態
  authReady: boolean; // 認証初期化完了フラグ
}

// Vuexストアを作成
export const store = createStore<RootState>({
  state: (): RootState => ({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isRefreshing: false,
    authReady: false,
  }),

  mutations: {
    setToken(state, accessToken: string | null) { // nullを許容
      state.accessToken = accessToken;
      state.isAuthenticated = !!accessToken;
    },
    setRefreshing(state, isRefreshing: boolean) {
      state.isRefreshing = isRefreshing;
    },
    setAuthReady(state, isReady: boolean) {
      state.authReady = isReady;
    },
    setUser(state, user: User) {
      state.user = user;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },

  actions: {
    // ログインアクション
    async login({ commit }, { username, password }) {
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
    logout({ commit }) {
      commit("clearAuth");
      // TODO: サーバーサイドのログアウトエンドポイントを呼び出す（必要であれば）
    },

    // ユーザー情報更新アクション
    async updateUser({ commit }, { newUsername, newEmail }) {
      const { success, user, error } = await $fetch("/api/account", {
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
    async fetchUser({ commit }) {
      try {
        const { data } = await $fetch("/api/auth/me", {
          headers: {
            // トークン付与はインターセプターで行う
          },
        });
        if (data && data.user) {
          commit("setUser", data.user);
        }
      } catch (error) {
        commit("clearAuth");
        console.error("Failed to fetch user", error);
      }
    },

    // トークンをリフレッシュするアクション
    async refreshToken({ commit, state }) {
      if (state.isRefreshing) {
        // 既にリフレッシュ中の場合は待機
        return new Promise((resolve) => {
          const unsubscribe = store.subscribe((mutation, state) => {
            if (mutation.type === 'setRefreshing' && !state.isRefreshing) {
              unsubscribe();
              resolve(state.accessToken);
            }
          });
        });
      }

      commit("setRefreshing", true);

      try {
        const response = await $fetch<{ accessToken: string }>("/api/auth/refresh", {
          method: "POST",
        });

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
    async initAuth({ commit, dispatch }) {
      if (process.server) return; // サーバーサイドでは実行しない

      try {
        await dispatch("fetchUser");
      } catch (e) {
        // 失敗してもエラーにはしない（単に未認証状態になるだけ）
        console.log("Not authenticated on init.");
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

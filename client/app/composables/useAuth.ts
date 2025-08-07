import { ref, computed } from "vue";

interface User {
  id: number;
  username: string;
  email: string;
}

// グローバルな認証状態
const user = ref<User | null>(null);
const token = ref<string | null>(null);

export const useAuth = () => {
  // 認証状態の初期化（クライアントサイドでのみ実行）
  const initAuth = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          token.value = storedToken;
          user.value = JSON.parse(storedUser);
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          // 無効なデータの場合はクリア
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
    }
  };

  // ログイン
  const login = (userData: User, authToken: string) => {
    user.value = userData;
    token.value = authToken;

    if (import.meta.client) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  // ログアウト
  const logout = () => {
    user.value = null;
    token.value = null;

    if (import.meta.client) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  };

  // 認証状態の確認
  const isAuthenticated = computed(() => {
    return user.value !== null && token.value !== null;
  });

  // ユーザー情報の取得
  const getCurrentUser = () => {
    return user.value;
  };

  // トークンの取得
  const getToken = () => {
    return token.value;
  };

  // 認証が必要なページでのリダイレクト
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      navigateTo("/login");
      return false;
    }
    return true;
  };

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    initAuth,
    login,
    logout,
    getCurrentUser,
    getToken,
    requireAuth,
  };
};

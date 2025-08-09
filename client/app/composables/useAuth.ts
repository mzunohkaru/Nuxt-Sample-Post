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

  // ユーザー情報の更新
  const updateUser = async (
    newUsername: string,
    newEmail: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const currentToken = getToken();
    if (!currentToken) {
      return { success: false, error: "認証されていません" };
    }

    try {
      const response = await $fetch<{ success: boolean; user: User; error?: string }>(
        "/api/account",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: { username: newUsername, email: newEmail },
        },
      );

      if (response.success && response.user) {
        // ローカルの状態を更新
        user.value = response.user;
        if (import.meta.client) {
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return { success: true };
      } else {
        return { success: false, error: response.error || "更新に失敗しました" };
      }
    } catch (error: any) {
      console.error("Failed to update user:", error);
      const errorMessage =
        error.data?.statusMessage || "サーバーエラーが発生しました";
      return { success: false, error: errorMessage };
    }
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
    updateUser, // 追加
  };
};

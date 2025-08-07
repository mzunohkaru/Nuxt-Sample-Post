<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { User } from "~~/types";

// 認証管理
const { login, isAuthenticated, initAuth } = useAuth();

// 既にログイン済みの場合はホームにリダイレクト
onMounted(() => {
  initAuth();
  if (isAuthenticated.value) {
    navigateTo("/");
  }
});

// フォームデータ
const formData = ref({
  username: "",
  password: "",
});

// 状態管理
const isSubmitting = ref(false);
const errorMessage = ref("");

// ログイン処理
const handleLogin = async () => {
  // バリデーション
  if (!formData.value.username || !formData.value.password) {
    errorMessage.value = "ユーザー名とパスワードを入力してください";
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: formData.value.username,
        password: formData.value.password,
      },
    });

    if (response.success) {
      // 認証状態を更新
      login(response.data.user as User, response.data.token);

      // ホームページにリダイレクト
      await navigateTo("/");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.statusCode === 401) {
      errorMessage.value = "ユーザー名またはパスワードが間違っています";
    } else if (error.statusCode === 400) {
      errorMessage.value = "ユーザー名とパスワードが必要です";
    } else {
      errorMessage.value = "ログインに失敗しました。もう一度お試しください。";
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Enterキーでログイン
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !isSubmitting.value) {
    handleLogin();
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">ログイン</h1>

      <!-- エラーメッセージ -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- ログインフォーム -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label"
            >ユーザー名またはメールアドレス</label
          >
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="ユーザー名またはメールアドレスを入力"
            :disabled="isSubmitting"
            @keydown="handleKeydown"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">パスワード</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="パスワードを入力"
            :disabled="isSubmitting"
            @keydown="handleKeydown"
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isSubmitting || !formData.username || !formData.password"
        >
          <span v-if="isSubmitting">ログイン中...</span>
          <span v-else>ログイン</span>
        </button>
      </form>

      <!-- 登録リンク -->
      <div class="register-link">
        <p>アカウントをお持ちでない場合</p>
        <NuxtLink to="/register" class="register-link-text"
          >新規登録はこちら</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
/* メインコンテナ */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 1rem;
}

/* ログインカード */
.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

/* タイトル */
.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

/* エラーメッセージ */
.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #fecaca;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

/* フォーム */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

/* ログインボタン */
.login-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.login-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

/* 登録リンク */
.register-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.register-link p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.register-link-text {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
}

.register-link-text:hover {
  color: #2563eb;
  text-decoration: underline;
}
</style>

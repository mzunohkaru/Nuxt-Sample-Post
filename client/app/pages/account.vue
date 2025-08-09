<script setup lang="ts">
import { onMounted } from "vue";

// 認証状態管理 - isAuthenticatedを削除
const { initAuth, getCurrentUser, requireAuth } = useAuth();

// 認証チェック
onMounted(() => {
  initAuth();
  if (!requireAuth()) {
    return;
  }
});

// ユーザー情報
const user = getCurrentUser();
</script>

<template>
  <div class="account-container">
    <div class="account-card">
      <!-- ヘッダー -->
      <div class="account-header">
        <h1 class="account-title">アカウント情報</h1>
        <p class="account-subtitle">あなたのプロフィール情報を確認できます</p>
      </div>

      <!-- ユーザー情報 -->
      <div v-if="user" class="user-info-section">
        <div class="info-grid">
          <div class="info-item">
            <label class="info-label">ユーザー名</label>
            <div class="info-value">{{ user.username }}</div>
          </div>

          <div class="info-item">
            <label class="info-label">メールアドレス</label>
            <div class="info-value">{{ user.email }}</div>
          </div>

          <div class="info-item">
            <label class="info-label">ユーザーID</label>
            <div class="info-value">#{{ user.id }}</div>
          </div>
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="action-section">
        <NuxtLink to="/" class="back-button">
          <svg
            class="button-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          投稿一覧に戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* メインコンテナ */
.account-container {
  min-height: calc(100vh - 4rem);
  background-color: #f9fafb;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* アカウントカード */
.account-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
}

/* ヘッダー */
.account-header {
  background-color: #f8fafc;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

.account-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.account-subtitle {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

/* ユーザー情報セクション */
.user-info-section {
  padding: 2rem;
}

.info-grid {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  color: #1f2937;
  padding: 0.75rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

/* アクションセクション */
.action-section {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f8fafc;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.15s ease;
}

.back-button:hover {
  background-color: #2563eb;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* レスポンシブ対応 */
@media (max-width: 640px) {
  .account-container {
    padding: 1rem;
  }

  .account-header {
    padding: 1.5rem;
  }

  .account-title {
    font-size: 1.5rem;
  }

  .user-info-section {
    padding: 1.5rem;
  }

  .action-section {
    padding: 1.5rem;
  }
}
</style>

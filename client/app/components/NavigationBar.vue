<script setup lang="ts">
import { ref, computed } from "vue";
import { useStore } from "vuex";
import type { RootState } from "~/store";

// Vuexストアを取得
const store = useStore<RootState>();

// 認証状態とユーザー情報をストアから取得
const isAuthenticated = computed(() => store.getters.isAuthenticated);
const currentUser = computed(() => store.getters.currentUser);

// モバイルメニューの状態
const isMobileMenuOpen = ref(false);

// ログアウト処理
const handleLogout = async () => {
  try {
    await store.dispatch("logout");
    closeMobileMenu();
    await navigateTo("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    // エラーが発生してもログイン画面にリダイレクト
    closeMobileMenu();
    await navigateTo("/login");
  }
};

// モバイルメニューの切り替え
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// メニューを閉じる
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <!-- ロゴ/ブランド -->
      <div class="nav-brand">
        <NuxtLink to="/" class="brand-link" @click="closeMobileMenu">
          <h1 class="brand-title">Posts</h1>
        </NuxtLink>
      </div>

      <!-- デスクトップナビゲーション -->
      <div class="nav-desktop">
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link" active-class="nav-link-active">
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            投稿一覧
          </NuxtLink>

          <NuxtLink
            v-if="isAuthenticated"
            to="/account"
            class="nav-link"
            active-class="nav-link-active"
          >
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            アカウント
          </NuxtLink>
        </div>

        <!-- ユーザー情報とログアウト -->
        <div v-if="isAuthenticated" class="user-section">
          <span class="welcome-text"> {{ currentUser?.username }}さん </span>
          <button class="logout-button" @click="handleLogout">
            <svg
              class="logout-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ログアウト
          </button>
        </div>

        <!-- 未認証時のログインリンク -->
        <div v-else class="auth-section">
          <NuxtLink to="/login" class="login-link">ログイン</NuxtLink>
        </div>
      </div>

      <!-- モバイルメニューボタン -->
      <button class="mobile-menu-button" @click="toggleMobileMenu">
        <svg
          class="mobile-menu-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="!isMobileMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- モバイルメニュー -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <div class="mobile-nav-links">
        <NuxtLink
          to="/"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="closeMobileMenu"
        >
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          投稿一覧
        </NuxtLink>

        <NuxtLink
          v-if="isAuthenticated"
          to="/account"
          class="mobile-nav-link"
          active-class="mobile-nav-link-active"
          @click="closeMobileMenu"
        >
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          アカウント
        </NuxtLink>
      </div>

      <!-- モバイル用ユーザーセクション -->
      <div v-if="isAuthenticated" class="mobile-user-section">
        <div class="mobile-welcome-text">{{ currentUser?.username }}さん</div>
        <button class="mobile-logout-button" @click="handleLogout">
          <svg
            class="logout-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          ログアウト
        </button>
      </div>

      <!-- モバイル用未認証セクション -->
      <div v-else class="mobile-auth-section">
        <NuxtLink to="/login" class="mobile-login-link" @click="closeMobileMenu"
          >ログイン</NuxtLink
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ナビゲーションバー */
.navigation-bar {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

/* ブランド */
.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* デスクトップナビゲーション */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.nav-link-active {
  color: #3b82f6;
  background-color: #eff6ff;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* ユーザーセクション */
.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.logout-button:hover {
  background-color: #dc2626;
}

.logout-icon {
  width: 1rem;
  height: 1rem;
}

/* 認証セクション */
.auth-section {
  display: flex;
  align-items: center;
}

.login-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
}

.login-link:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

/* モバイルメニューボタン */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* モバイルメニュー */
.mobile-menu {
  display: none;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.15s ease;
}

.mobile-nav-link:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.mobile-nav-link-active {
  color: #3b82f6;
  background-color: #eff6ff;
}

/* モバイルユーザーセクション */
.mobile-user-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.mobile-welcome-text {
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.mobile-logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ef4444;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease;
  width: 100%;
  justify-content: center;
}

.mobile-logout-button:hover {
  background-color: #dc2626;
}

/* モバイル認証セクション */
.mobile-auth-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.mobile-login-link {
  display: block;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-align: center;
  transition: all 0.15s ease;
}

.mobile-login-link:hover {
  color: #2563eb;
  background-color: #eff6ff;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .nav-desktop {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-menu {
    display: block;
  }
}
</style>

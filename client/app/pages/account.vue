<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import type { RootState } from "~/app/store";

// Vuexストアを取得
const store = useStore<RootState>();

// ユーザー情報をストアから取得
const user = computed(() => store.getters.currentUser);

// 編集モードの状態
const isEditing = ref(false);
const editUsername = ref("");
const editEmail = ref("");

// 通知の状態
const notification = ref<{ type: "success" | "error"; message: string } | null>(
  null,
);

// フォームの初期化
onMounted(() => {
  if (user.value) {
    editUsername.value = user.value.username;
    editEmail.value = user.value.email;
  }
});

// 編集モードを開始
function startEditing() {
  if (user.value) {
    editUsername.value = user.value.username;
    editEmail.value = user.value.email;
    isEditing.value = true;
    notification.value = null; // 編集開始時に通知をクリア
  }
}

// 編集をキャンセル
function cancelEditing() {
  isEditing.value = false;
}

// ユーザー情報を更新
async function handleUpdate() {
  notification.value = null; // 新しい操作の前に通知をクリア

  try {
    await store.dispatch("updateUser", {
      newUsername: editUsername.value,
      newEmail: editEmail.value,
    });

    isEditing.value = false;
    notification.value = {
      type: "success",
      message: "ユーザー情報を更新しました。",
    };
  } catch (error: any) {
    notification.value = {
      type: "error",
      message: error.message || "更新に失敗しました。",
    };
  }
}
</script>

<template>
  <div class="account-container">
    <div class="account-card">
      <!-- ヘッダー -->
      <div class="account-header">
        <h1 class="account-title">アカウント情報</h1>
        <p class="account-subtitle">
          {{
            isEditing
              ? "プロフィール情報を編集します"
              : "あなたのプロフィール情報を確認できます"
          }}
        </p>
      </div>

      <!-- 通知エリア -->
      <div v-if="notification" :class="`notification is-${notification.type}`">
        {{ notification.message }}
      </div>

      <!-- ユーザー情報表示・編集フォーム -->
      <div v-if="user" class="user-info-section">
        <form @submit.prevent="handleUpdate">
          <div class="info-grid">
            <!-- ユーザー名 -->
            <div class="info-item">
              <label for="username" class="info-label">ユーザー名</label>
              <div v-if="!isEditing" class="info-value">
                {{ user.username }}
              </div>
              <input
                v-else
                id="username"
                v-model="editUsername"
                type="text"
                class="info-input"
              />
            </div>

            <!-- メールアドレス -->
            <div class="info-item">
              <label for="email" class="info-label">メールアドレス</label>
              <div v-if="!isEditing" class="info-value">{{ user.email }}</div>
              <input
                v-else
                id="email"
                v-model="editEmail"
                type="email"
                class="info-input"
              />
            </div>

            <!-- ユーザーID（編集不可） -->
            <div class="info-item">
              <label class="info-label">ユーザーID</label>
              <div class="info-value">#{{ user.id }}</div>
            </div>
          </div>

          <!-- 編集中のアクションボタン -->
          <div v-if="isEditing" class="editing-actions">
            <button type="button" class="cancel-button" @click="cancelEditing">
              キャンセル
            </button>
            <button type="submit" class="save-button">変更を保存</button>
          </div>
        </form>
      </div>
      <div v-else class="loading-state">
        <p>ユーザー情報を読み込んでいます...</p>
      </div>

      <!-- アクションセクション -->
      <div class="action-section">
        <button
          v-if="!isEditing"
          class="edit-button"
          @click="startEditing"
        >
          プロフィールを編集
        </button>
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
/* 基本スタイルは省略（既存のものをベースとする） */
.account-container {
  min-height: calc(100vh - 4rem);
  background-color: #f9fafb;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.account-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
  overflow: hidden;
}
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
.user-info-section {
  padding: 2rem;
}
.loading-state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
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
.action-section {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.15s ease;
  border: 1px solid #d1d5db;
}
.back-button:hover {
  background-color: #f3f4f6;
}
.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* --- 追加・変更したスタイル --- */

/* 編集用インプット */
.info-input {
  font-size: 1.125rem;
  color: #1f2937;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.info-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
}

/* 編集中のアクションボタン */
.editing-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button,
.save-button,
.edit-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.edit-button {
  background-color: #3b82f6;
  color: white;
}
.edit-button:hover {
  background-color: #2563eb;
}

.cancel-button {
  background-color: #e5e7eb;
  color: #374151;
}
.cancel-button:hover {
  background-color: #d1d5db;
}

.save-button {
  background-color: #10b981;
  color: white;
}
.save-button:hover {
  background-color: #059669;
}

/* 通知 */
.notification {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 500;
  text-align: center;
}
.notification.is-success {
  background-color: #d1fae5;
  color: #065f46;
}
.notification.is-error {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (max-width: 640px) {
  .account-container {
    padding: 1rem;
  }
  .account-header,
  .user-info-section,
  .action-section {
    padding: 1.5rem;
  }
  .account-title {
    font-size: 1.5rem;
  }
}
</style>

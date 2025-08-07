<script setup lang="ts">
import { ref } from "vue";

const { data, pending, error, refresh } = await useFetch("/api/posts");

// 新しい投稿用のリアクティブデータ
const newPost = ref({
  title: "",
  content: "",
});

const isSubmitting = ref(false);

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "たった今";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分前`;
  } else if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  } else if (diffInDays < 7) {
    return `${diffInDays}日前`;
  } else {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

// 投稿送信関数
const submitPost = async () => {
  if (!newPost.value.title || !newPost.value.content) {
    alert("タイトルと内容を入力してください");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/posts", {
      method: "POST",
      body: {
        title: newPost.value.title,
        content: newPost.value.content,
      },
    });

    if (response.success) {
      // フォームをクリア
      newPost.value.title = "";
      newPost.value.content = "";

      // 投稿リストを更新
      await refresh();

      alert("投稿が正常に作成されました！");
    }
  } catch (error) {
    console.error("投稿の作成中にエラーが発生しました:", error);
    alert("投稿の作成に失敗しました。もう一度お試しください。");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="main-container">
    <h1 class="main-title">Posts</h1>

    <!-- 投稿フォーム -->
    <div class="post-form-container">
      <div class="post-form-header">
        <div class="post-form-header-content">
          <div class="post-form-icon-container">
            <svg
              class="post-form-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 class="post-form-title">
            新しい投稿を作成
          </h2>
        </div>
      </div>

      <form class="post-form" @submit.prevent="submitPost">
        <div class="form-fields">
          <div>
            <label
              for="title"
              class="form-field-label"
            >
              <span class="form-field-label-content">
                <svg
                  class="form-field-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                タイトル
              </span>
            </label>
            <input
              id="title"
              v-model="newPost.title"
              type="text"
              class="form-input"
              placeholder="投稿のタイトルを入力してください"
              required
            />
          </div>

          <div>
            <label
              for="content"
              class="form-field-label"
            >
              <span class="form-field-label-content">
                <svg
                  class="form-field-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                内容
              </span>
            </label>
            <textarea
              id="content"
              v-model="newPost.content"
              rows="4"
              class="form-textarea"
              placeholder="投稿の内容を入力してください"
              required
            />
          </div>
        </div>

        <div class="form-submit-container">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="form-submit-button"
          >
            <svg
              v-if="isSubmitting"
              class="submit-spinner"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="submit-spinner-circle"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="submit-spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <svg
              v-else
              class="submit-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {{ isSubmitting ? "投稿中..." : "投稿する" }}
          </button>
        </div>
      </form>
    </div>

    <!-- ローディング状態 -->
    <div v-if="pending" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner" />
        <p class="loading-text">投稿を読み込み中...</p>
      </div>
    </div>

    <!-- エラー状態 -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <div class="error-icon-container">
          <svg
            class="error-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="error-text-container">
          <h3 class="error-title">エラーが発生しました</h3>
          <p class="error-message">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- 投稿一覧 -->
      <div v-if="data?.success && data.data.length > 0" class="posts-container">
        <h2 class="posts-title">投稿一覧</h2>
        <div class="posts-grid">
          <article
            v-for="post in data.data"
            :key="post.id"
            class="post-card"
          >
            <!-- カードヘッダー -->
            <div class="post-card-content">
              <div class="post-card-header">
                <h3 class="post-card-title">
                  {{ post.title }}
                </h3>
                <div class="post-card-status-container">
                  <div class="post-card-status-dot"/>
                </div>
              </div>

              <!-- 投稿内容 -->
              <div class="post-card-body">
                <p class="post-card-text">
                  {{ post.content }}
                </p>
              </div>

              <!-- フッター -->
              <div class="post-card-footer">
                <div class="post-card-time-container">
                  <svg
                    class="post-card-time-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <time :datetime="post.created_at">
                    {{ formatDate(post.created_at) }}
                  </time>
                </div>
                <div class="post-card-actions">
                  <button class="post-card-action-button">
                    <svg
                      class="post-card-action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button class="post-card-action-button">
                    <svg
                      class="post-card-action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- 投稿がない場合 -->
      <div v-else class="no-posts-container">
        <div class="no-posts-content">
          <div class="no-posts-icon-container">
            <svg
              class="no-posts-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="no-posts-title">
            まだ投稿がありません
          </h3>
          <p class="no-posts-text">
            上のフォームから最初の投稿を作成してみましょう。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* メインコンテナ */
.main-container {
  padding: 1rem;
}

.main-title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

/* 投稿フォーム */
.post-form-container {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.post-form-header {
  background: linear-gradient(to right, #eff6ff, #eef2ff);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.post-form-header-content {
  display: flex;
  align-items: center;
}

.post-form-icon-container {
  flex-shrink: 0;
}

.post-form-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #2563eb;
}

.post-form-title {
  margin-left: 0.75rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #111827;
}

.post-form {
  padding: 1.5rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field-label {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-field-label-content {
  display: flex;
  align-items: center;
}

.form-field-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  transition: all 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  border-color: transparent;
}

.form-input::placeholder {
  color: #6b7280;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  resize: none;
  transition: all 0.15s ease-in-out;
}

.form-textarea:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  border-color: transparent;
}

.form-textarea::placeholder {
  color: #6b7280;
}

.form-submit-container {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.form-submit-button {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.form-submit-button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.form-submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.form-submit-button:focus {
  outline: none;
  ring: 2px solid #3b82f6;
  ring-offset: 2px;
}

.submit-spinner {
  animation: spin 1s linear infinite;
  margin-left: -0.25rem;
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  color: white;
}

.submit-spinner-circle {
  opacity: 0.25;
}

.submit-spinner-path {
  opacity: 0.75;
}

.submit-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

/* ローディング状態 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
  border-radius: 50%;
  height: 2rem;
  width: 2rem;
  border-bottom: 2px solid #2563eb;
  margin-bottom: 1rem;
}

.loading-text {
  color: #4b5563;
}

/* エラー状態 */
.error-container {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.error-content {
  display: flex;
  align-items: center;
}

.error-icon-container {
  flex-shrink: 0;
}

.error-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #dc2626;
}

.error-text-container {
  margin-left: 0.75rem;
}

.error-title {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #991b1b;
}

.error-message {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #b91c1c;
  margin-top: 0.25rem;
}

/* 投稿一覧 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.posts-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.posts-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.post-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
}

.post-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.post-card-content {
  padding: 1.5rem;
}

.post-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.post-card-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.25;
}

.post-card-status-container {
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.post-card-status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #34d399;
  border-radius: 50%;
}

.post-card-body {
  margin-bottom: 1rem;
}

.post-card-text {
  color: #374151;
  line-height: 1.625;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.post-card-time-container {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
}

.post-card-time-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

.post-card-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.post-card-action-button {
  padding: 0.25rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
}

.post-card-action-button:hover {
  color: #4b5563;
}

.post-card-action-icon {
  width: 1rem;
  height: 1rem;
}

/* 投稿がない場合 */
.no-posts-container {
  text-align: center;
  padding: 3rem 0;
}

.no-posts-content {
  max-width: 24rem;
  margin: 0 auto;
}

.no-posts-icon-container {
  background-color: #f9fafb;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.no-posts-icon {
  width: 2rem;
  height: 2rem;
  color: #9ca3af;
}

.no-posts-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
}

.no-posts-text {
  color: #6b7280;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

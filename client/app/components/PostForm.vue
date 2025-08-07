<script setup lang="ts">
import { ref } from "vue";

// Props
interface Props {
  isSubmitting?: boolean;
}

// props変数を削除し、withDefaultsの結果を直接使用
withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});

// Emits
interface Emits {
  (e: "submit", data: { title: string; content: string }): void;
}

const emit = defineEmits<Emits>();

// 新しい投稿用のリアクティブデータ
const newPost = ref({
  title: "",
  content: "",
});

// 投稿送信関数
const submitPost = () => {
  if (!newPost.value.title || !newPost.value.content) {
    alert("タイトルと内容を入力してください");
    return;
  }

  emit("submit", {
    title: newPost.value.title,
    content: newPost.value.content,
  });

  // フォームをクリア
  newPost.value.title = "";
  newPost.value.content = "";
};
</script>

<template>
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
        <h2 class="post-form-title">新しい投稿を作成</h2>
      </div>
    </div>

    <form class="post-form" @submit.prevent="submitPost">
      <div class="form-fields">
        <div>
          <label for="title" class="form-field-label">
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
          <label for="content" class="form-field-label">
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
</template>

<style scoped>
/* 投稿フォーム */
.post-form-container {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

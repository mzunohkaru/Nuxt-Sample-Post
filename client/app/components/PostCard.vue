<script setup lang="ts">
import type { Post } from "~~/types";

// Props
interface Props {
  post: Post;
}

defineProps<Props>();

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
</script>

<template>
  <article class="post-card">
    <!-- カードヘッダー -->
    <div class="post-card-content">
      <div class="post-card-header">
        <h3 class="post-card-title">
          {{ post.title }}
        </h3>
        <div class="post-card-status-container">
          <div class="post-card-status-dot" />
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
        <div class="post-card-meta">
          <div class="post-card-author">
            <svg
              class="post-card-author-icon"
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
            <span class="author-name">{{ post.username }}</span>
          </div>
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
</template>

<style scoped>
.post-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
}

.post-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
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
  line-clamp: 3;
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

.post-card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.post-card-author {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #374151;
}

.post-card-author-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
  color: #6b7280;
}

.author-name {
  font-weight: 500;
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
</style>

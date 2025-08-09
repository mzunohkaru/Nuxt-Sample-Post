<script setup lang="ts">
// Props
interface Props {
  title?: string;
  message?: string;
  icon?: string;
}

// props変数を削除し、withDefaultsの結果を直接使用
withDefaults(defineProps<Props>(), {
  title: "まだ投稿がありません",
  message: "上のフォームから最初の投稿を作成してみましょう。",
  icon: "document",
});
</script>

<template>
  <div class="no-posts-container">
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
        {{ title }}
      </h3>
      <p class="no-posts-text">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
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
</style>

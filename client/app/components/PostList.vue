<script setup lang="ts">
import PostCard from "./PostCard.vue";

// Props
interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Props {
  posts: Post[];
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "投稿一覧",
});
</script>

<template>
  <div class="posts-container">
    <h2 class="posts-title">{{ title }}</h2>
    <div class="posts-grid">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<style scoped>
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
</style>

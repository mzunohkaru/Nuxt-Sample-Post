<script setup lang="ts">
// Props
interface Props {
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: "読み込み中...",
});
</script>

<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="loading-spinner" />
      <p class="loading-text">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

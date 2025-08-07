<script setup lang="ts">
// Props
interface Props {
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "エラーが発生しました",
  message: "何かしらの問題が発生しました。",
});
</script>

<template>
  <div class="error-container">
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
        <h3 class="error-title">{{ title }}</h3>
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Posts</h1>

    <div v-if="pending">Loading...</div>

    <div v-else-if="error">Error: {{ error.message }}</div>

    <div v-else>
      <ul v-if="data?.success && data.data.length > 0">
        <li v-for="post in data.data" :key="post.id" class="mb-2 p-2 border-b">
          Title: {{ post.title }} Content: {{ post.content }} Time:
          {{ post.created_at }}
        </li>
      </ul>
      <p v-else>No posts found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error } = await useFetch("/api/posts");
</script>

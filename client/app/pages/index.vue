<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Posts</h1>

    <!-- 投稿フォーム -->
    <div class="mb-6 p-4 border rounded bg-gray-50">
      <h2 class="text-lg font-semibold mb-3 text-black">新しい投稿を作成</h2>
      <form @submit.prevent="submitPost">
        <div class="mb-3">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
            >タイトル</label
          >
          <input
            id="title"
            v-model="newPost.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="投稿のタイトルを入力してください"
            required
          />
        </div>
        <div class="mb-3">
          <label
            for="content"
            class="block text-sm font-medium text-gray-700 mb-1"
            >内容</label
          >
          <textarea
            id="content"
            v-model="newPost.content"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="投稿の内容を入力してください"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? "投稿中..." : "投稿する" }}
        </button>
      </form>
    </div>

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
import { ref } from "vue";

const { data, pending, error, refresh } = await useFetch("/api/posts");

// 新しい投稿用のリアクティブデータ
const newPost = ref({
  title: "",
  content: "",
});

const isSubmitting = ref(false);

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

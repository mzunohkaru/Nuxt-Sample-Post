<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Posts</h1>

    <!-- 投稿フォーム -->
    <div
      class="mb-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-6 h-6 text-blue-600"
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
          <h2 class="ml-3 text-lg font-semibold text-gray-900">
            新しい投稿を作成
          </h2>
        </div>
      </div>

      <form @submit.prevent="submitPost" class="p-6">
        <div class="space-y-4">
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              <span class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors"
              placeholder="投稿のタイトルを入力してください"
              required
            />
          </div>

          <div>
            <label
              for="content"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              <span class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1"
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
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-colors resize-none"
              placeholder="投稿の内容を入力してください"
              required
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="w-4 h-4 mr-2"
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
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"
        ></div>
        <p class="text-gray-600">投稿を読み込み中...</p>
      </div>
    </div>

    <!-- エラー状態 -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg
            class="w-6 h-6 text-red-600"
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
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">エラーが発生しました</h3>
          <p class="text-sm text-red-700 mt-1">{{ error.message }}</p>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- 投稿一覧 -->
      <div v-if="data?.success && data.data.length > 0" class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">投稿一覧</h2>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="post in data.data"
            :key="post.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
          >
            <!-- カードヘッダー -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 leading-tight">
                  {{ post.title }}
                </h3>
                <div class="flex-shrink-0 ml-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>

              <!-- 投稿内容 -->
              <div class="mb-4">
                <p class="text-gray-700 leading-relaxed line-clamp-3">
                  {{ post.content }}
                </p>
              </div>

              <!-- フッター -->
              <div
                class="flex items-center justify-between pt-4 border-t border-gray-100"
              >
                <div class="flex items-center text-sm text-gray-500">
                  <svg
                    class="w-4 h-4 mr-1"
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
                <div class="flex items-center space-x-1">
                  <button
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
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
                  <button
                    class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
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
      <div v-else class="text-center py-12">
        <div class="max-w-sm mx-auto">
          <div
            class="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-8 h-8 text-gray-400"
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            まだ投稿がありません
          </h3>
          <p class="text-gray-500">
            上のフォームから最初の投稿を作成してみましょう。
          </p>
        </div>
      </div>
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

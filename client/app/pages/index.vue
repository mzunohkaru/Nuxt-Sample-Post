<script setup lang="ts">
import { ref, onMounted } from "vue";
import PostForm from "~/components/PostForm.vue";
import PostList from "~/components/PostList.vue";
import LoadingState from "~/components/LoadingState.vue";
import ErrorState from "~/components/ErrorState.vue";
import EmptyState from "~/components/EmptyState.vue";

// 認証状態管理 - isAuthenticatedとhandleLogoutを削除
const { initAuth, getCurrentUser, requireAuth } = useAuth();

// 認証チェック
onMounted(() => {
  initAuth();
  if (!requireAuth()) {
    return;
  }
});

const { data, pending, error, refresh } = await useFetch("/api/posts");

const isSubmitting = ref(false);

// 投稿送信関数
const handleSubmitPost = async (postData: {
  title: string;
  content: string;
}) => {
  isSubmitting.value = true;

  try {
    const currentUser = getCurrentUser();
    const response = await $fetch("/api/posts", {
      method: "POST",
      body: {
        title: postData.title,
        content: postData.content,
        user_id: currentUser?.id || 1,
      },
    });

    if (response.success) {
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
    <!-- ヘッダー -->
    <div class="header">
      <h1 class="main-title">投稿一覧</h1>
    </div>

    <!-- 投稿フォーム -->
    <PostForm :is-submitting="isSubmitting" @submit="handleSubmitPost" />

    <!-- ローディング状態 -->
    <LoadingState v-if="pending" message="投稿を読み込み中..." />

    <!-- エラー状態 -->
    <ErrorState v-else-if="error" :message="error.message" />

    <div v-else>
      <!-- 投稿一覧 -->
      <PostList
        v-if="data?.success && data.data.length > 0"
        :posts="data.data"
      />

      <!-- 投稿がない場合 -->
      <EmptyState v-else />
    </div>
  </div>
</template>

<style scoped>
/* メインコンテナ */
.main-container {
  padding: 1rem;
}

/* ヘッダー */
.header {
  margin-bottom: 1.5rem;
}

.main-title {
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 700;
  margin: 0;
}
</style>

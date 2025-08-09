<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
// @ts-ignore
import { useStore } from "vuex";
import type { RootState } from "~/store";
import PostForm from "~/components/PostForm.vue";
import PostList from "~/components/PostList.vue";
import LoadingState from "~/components/LoadingState.vue";
import ErrorState from "~/components/ErrorState.vue";
import EmptyState from "~/components/EmptyState.vue";
import { ofetch } from "ofetch";

// Vuexストアを取得
const store = useStore<RootState>();

// 認証トークンを取得
const accessToken = computed(() => store.getters.accessToken);

// データ状態
const data = ref<any>(null);
const pending = ref(false);
const error = ref<any>(null);

// 認証ヘッダーを生成する関数
const getAuthHeaders = () => {
  const headers: Record<string, string> = {};
  if (accessToken.value) {
    headers.Authorization = `Bearer ${accessToken.value}`;
  }
  return headers;
};

// 投稿データを取得する関数
const fetchPosts = async () => {
  pending.value = true;
  error.value = null;

  try {
    const response = await ofetch("/api/posts", {
      headers: getAuthHeaders(),
    });
    data.value = response;
  } catch (err) {
    console.error("投稿の取得中にエラーが発生しました:", err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

// リフレッシュ関数
const refresh = async () => {
  await fetchPosts();
};

// コンポーネントがマウントされたときに投稿を取得
onMounted(async () => {
  await fetchPosts();
});

const isSubmitting = ref(false);

// 投稿送信関数
const handleSubmitPost = async (postData: {
  title: string;
  content: string;
}) => {
  isSubmitting.value = true;

  try {
    // user_idはサーバーサイドで認証情報から取得するため、送信不要
    await ofetch("/api/posts", {
      method: "POST",
      headers: getAuthHeaders(),
      body: {
        title: postData.title,
        content: postData.content,
      },
    });

    // 投稿リストを更新
    await refresh();
  } catch (err) {
    console.error("投稿の作成中にエラーが発生しました:", err);
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
    <ErrorState
      v-else-if="error"
      :message="error.data?.statusMessage || '投稿の読み込みに失敗しました'"
    />

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

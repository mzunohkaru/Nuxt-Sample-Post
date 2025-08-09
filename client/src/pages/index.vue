<template>
  <div>
    <h1 class="text-h4 mb-4">投稿一覧</h1>

    <PostForm :is-submitting="isSubmitting" @submit="handleSubmitPost" />

    <v-alert v-if="error" type="error" dense class="my-4">
      {{ error.message || '投稿の読み込みに失敗しました' }}
    </v-alert>

    <div v-if="!error">
      <PostList v-if="posts && posts.length > 0" :posts="posts" />
      <v-alert v-else type="info" class="mt-4">
        投稿はまだありません。
      </v-alert>
    </div>
  </div>
</template>

<script>
import PostForm from '~/components/PostForm.vue'
import PostList from '~/components/PostList.vue'

export default {
  components: {
    PostForm,
    PostList,
  },
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/api/posts')
      if (data.success) {
        return { posts: data.data, error: null }
      }
      return { posts: [], error: { message: '投稿の取得に失敗しました。' } }
    } catch (err) {
      return { posts: [], error: err }
    }
  },
  data() {
    return {
      posts: [],
      error: null,
      isSubmitting: false,
    }
  },
  methods: {
    async handleSubmitPost(postData) {
      this.isSubmitting = true
      try {
        await this.$axios.post('/api/posts', postData)
        // Refresh the posts list
        const { data } = await this.$axios.get('/api/posts')
        if (data.success) {
          this.posts = data.data
        }
      } catch (err) {
        console.error('投稿の作成中にエラーが発生しました:', err)
        alert('投稿の作成に失敗しました。もう一度お試しください。')
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

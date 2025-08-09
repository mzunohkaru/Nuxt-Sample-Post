<template>
  <v-card class="mb-5">
    <v-card-title>
      <v-icon left>mdi-plus-box</v-icon>
      新しい投稿を作成
    </v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitPost">
        <v-text-field
          v-model="newPost.title"
          label="タイトル"
          required
          outlined
          dense
        ></v-text-field>
        <v-textarea
          v-model="newPost.content"
          label="内容"
          required
          outlined
          dense
          rows="4"
        ></v-textarea>
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          <v-icon left>mdi-send</v-icon>
          {{ isSubmitting ? "投稿中..." : "投稿する" }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newPost: {
        title: '',
        content: '',
      },
    }
  },
  methods: {
    submitPost() {
      if (!this.newPost.title || !this.newPost.content) {
        alert('タイトルと内容を入力してください')
        return
      }
      this.$emit('submit', { ...this.newPost })
      this.newPost.title = ''
      this.newPost.content = ''
    },
  },
}
</script>

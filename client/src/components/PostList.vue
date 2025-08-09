<template>
  <div>
    <h2 class="text-h5 mb-4">{{ title }}</h2>
    <v-container fluid>
      <v-row>
        <v-col
          v-for="post in posts"
          :key="post.id"
          cols="12"
          sm="6"
          md="4"
        >
          <PostCard :post="post" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PostCard from "./PostCard.vue";

export default {
  components: {
    PostCard,
  },
  props: {
    posts: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "投稿一覧",
    },
  },
};
</script>

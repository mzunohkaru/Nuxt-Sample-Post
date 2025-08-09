<template>
  <v-card>
    <v-card-title class="pb-0">
      {{ post.title }}
    </v-card-title>
    <v-card-text>
      <p class="text--primary">
        {{ post.content }}
      </p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            alt=""
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ post.username }}</v-list-item-title>
        </v-list-item-content>

        <v-row
          align="center"
          justify="end"
        >
          <v-icon class="mr-1">
            mdi-clock-outline
          </v-icon>
          <span class="subheading mr-2">{{ formatDate(post.created_at) }}</span>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
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
    },
  },
};
</script>

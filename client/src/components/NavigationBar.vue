<template>
  <div>
    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <nuxt-link to="/" class="white--text" style="text-decoration: none;">Posts</nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Desktop links -->
      <div class="d-none d-md-flex">
        <v-btn text to="/">
          <v-icon left>mdi-post</v-icon>
          投稿一覧
        </v-btn>
        <v-btn text to="/account" v-if="isAuthenticated">
          <v-icon left>mdi-account</v-icon>
          アカウント
        </v-btn>
        <span v-if="isAuthenticated" class="white--text align-self-center mx-4">
          {{ currentUser.username }}さん
        </span>
        <v-btn v-if="isAuthenticated" color="red" @click="handleLogout">
          <v-icon left>mdi-logout</v-icon>
          ログアウト
        </v-btn>
        <v-btn text to="/login" v-else>
          ログイン
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-post</v-icon>
            </v-list-item-icon>
            <v-list-item-title>投稿一覧</v-list-item-title>
          </v-list-item>
          <v-list-item to="/account" v-if="isAuthenticated">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>アカウント</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item v-if="isAuthenticated">
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">{{ currentUser.username }}さん</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="handleLogout" v-if="isAuthenticated">
            <v-list-item-icon>
              <v-icon color="red">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="red--text">ログアウト</v-list-item-title>
          </v-list-item>

           <v-list-item to="/login" v-else>
             <v-list-item-icon>
               <v-icon>mdi-login</v-icon>
             </v-list-item-icon>
            <v-list-item-title>ログイン</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      try {
        await this.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
.white--text {
  color: white !important;
}
</style>

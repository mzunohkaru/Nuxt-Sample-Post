<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>ログイン</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-alert v-if="errorMessage" type="error" dense class="mb-4">
                {{ errorMessage }}
              </v-alert>
              <v-text-field
                v-model="formData.username"
                label="ユーザー名またはメールアドレス"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                :disabled="isSubmitting"
                autocomplete="username"
              ></v-text-field>
              <v-text-field
                v-model="formData.password"
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :disabled="isSubmitting"
                autocomplete="current-password"
              ></v-text-field>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="isSubmitting"
                  :disabled="isSubmitting || !formData.username || !formData.password"
                >
                  ログイン
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: 'guest',
  layout: 'default', // You might want a different layout for login
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
      isSubmitting: false,
      errorMessage: '',
    }
  },
  methods: {
    async handleLogin() {
      if (!this.formData.username || !this.formData.password) {
        this.errorMessage = 'ユーザー名とパスワードを入力してください'
        return
      }
      this.isSubmitting = true
      this.errorMessage = ''
      try {
        await this.$store.dispatch('login', this.formData)
        this.$router.push('/')
      } catch (error) {
        console.error('Login error:', error)
        this.errorMessage =
          error.response?.data?.message || 'ログインに失敗しました。もう一度お試しください。'
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

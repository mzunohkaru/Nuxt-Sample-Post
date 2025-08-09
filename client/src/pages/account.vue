<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">
            アカウント情報
          </v-card-title>
          <v-card-subtitle>
            {{ isEditing ? "プロフィール情報を編集します" : "あなたのプロフィール情報を確認できます" }}
          </v-card-subtitle>

          <v-alert v-if="notification" :type="notification.type" dense dismissible class="mx-4">
            {{ notification.message }}
          </v-alert>

          <v-card-text v-if="user">
            <v-form @submit.prevent="handleUpdate">
              <v-text-field
                v-model="editUsername"
                label="ユーザー名"
                :readonly="!isEditing"
                :outlined="isEditing"
                :solo="!isEditing"
                flat
              ></v-text-field>
              <v-text-field
                v-model="editEmail"
                label="メールアドレス"
                :readonly="!isEditing"
                :outlined="isEditing"
                :solo="!isEditing"
                flat
              ></v-text-field>
              <v-text-field
                :value="`#${user.id}`"
                label="ユーザーID"
                readonly
                solo
                flat
              ></v-text-field>

              <v-card-actions v-if="isEditing">
                <v-spacer></v-spacer>
                <v-btn text @click="cancelEditing">キャンセル</v-btn>
                <v-btn color="primary" type="submit">変更を保存</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
           <v-card-text v-else>
            <p>ユーザー情報を読み込んでいます...</p>
          </v-card-text>

          <v-card-actions v-if="!isEditing">
            <v-btn text to="/">
              <v-icon left>mdi-arrow-left</v-icon>
              投稿一覧に戻る
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="startEditing">
              プロフィールを編集
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      isEditing: false,
      editUsername: '',
      editEmail: '',
      notification: null,
    }
  },
  computed: {
    ...mapGetters({
      user: 'currentUser',
    }),
  },
  created() {
    this.initializeForm()
  },
  methods: {
    initializeForm() {
      if (this.user) {
        this.editUsername = this.user.username
        this.editEmail = this.user.email
      }
    },
    startEditing() {
      this.isEditing = true
      this.notification = null
    },
    cancelEditing() {
      this.isEditing = false
      this.initializeForm()
    },
    async handleUpdate() {
      this.notification = null
      try {
        await this.$store.dispatch('updateUser', {
          newUsername: this.editUsername,
          newEmail: this.editEmail,
        })
        this.isEditing = false
        this.notification = {
          type: 'success',
          message: 'ユーザー情報を更新しました。',
        }
      } catch (error) {
        this.notification = {
          type: 'error',
          message: error.message || '更新に失敗しました。',
        }
      }
    },
  },
  watch: {
    user() {
      // This handles the case where the user data is loaded after the component is created
      this.initializeForm()
    }
  }
}
</script>

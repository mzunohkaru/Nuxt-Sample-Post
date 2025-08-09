import type { User } from '~/types'

export interface RootState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  isRefreshing: boolean // トークンリフレッシュ中の状態
  authReady: boolean // 認証初期化完了フラグ
}

const getStoredToken = (): string | null => {
  if (process.client) {
    try {
      return localStorage.getItem('accessToken')
    } catch (e) {
      console.warn('Failed to get stored token:', e)
      return null
    }
  }
  return null
}

const setStoredToken = (token: string | null): void => {
  if (process.client) {
    try {
      if (token) {
        localStorage.setItem('accessToken', token)
      } else {
        localStorage.removeItem('accessToken')
      }
    } catch (e) {
      console.warn('Failed to store token:', e)
    }
  }
}

export const state = () => ({
  accessToken: getStoredToken(),
  user: null,
  isAuthenticated: !!getStoredToken(),
  isRefreshing: false,
  authReady: false,
})

export const mutations = {
  setToken(state: RootState, accessToken: string | null) {
    state.accessToken = accessToken
    state.isAuthenticated = !!accessToken
    setStoredToken(accessToken)
  },
  setRefreshing(state: RootState, isRefreshing: boolean) {
    state.isRefreshing = isRefreshing
  },
  setAuthReady(state: RootState, isReady: boolean) {
    state.authReady = isReady
  },
  setUser(state: RootState, user: User) {
    state.user = user
  },
  clearAuth(state: RootState) {
    state.accessToken = null
    state.user = null
    state.isAuthenticated = false
    setStoredToken(null)
  },
}

export const actions = {
  async login({ commit }: any, { username, password }: { username: string; password: string }) {
    const { data } = await this.$axios.post('/api/auth/login', { username, password })
    if (data) {
      commit('setToken', data.accessToken)
      commit('setUser', data.user)
    }
  },

  async logout({ commit }: any) {
    try {
      await this.$axios.post('/api/auth/logout')
    } catch (error) {
      console.warn('Server logout failed:', error)
    } finally {
      commit('clearAuth')
    }
  },

  async updateUser({ commit }: any, { newUsername, newEmail }: { newUsername: string; newEmail: string }) {
    const { data } = await this.$axios.put('/api/account', { username: newUsername, email: newEmail })
    if (data.success && data.user) {
      commit('setUser', data.user)
      return { success: true }
    } else {
      throw new Error(data.error || '更新に失敗しました')
    }
  },

  async fetchUser({ commit, state }: any) {
    try {
      const headers: Record<string, string> = {}
      if (state.accessToken) {
        headers.Authorization = `Bearer ${state.accessToken}`
      }
      const { data } = await this.$axios.get('/api/auth/me', { headers })
      if (data && data.user) {
        commit('setUser', data.user)
        return true
      }
      return false
    } catch (error) {
      commit('clearAuth')
      console.error('Failed to fetch user', error)
      return false
    }
  },

  async refreshToken({ commit, state }: any) {
    if (state.isRefreshing) {
      return
    }
    commit('setRefreshing', true)
    try {
      const { data } = await this.$axios.post('/api/auth/refresh')
      if (data.accessToken) {
        commit('setToken', data.accessToken)
        return data.accessToken
      }
      throw new Error('New access token not received')
    } catch (error) {
      commit('clearAuth')
      console.error('Failed to refresh token', error)
      return null
    } finally {
      commit('setRefreshing', false)
    }
  },

  async initAuth({ dispatch, commit, state }: any) {
    if (!process.client) return

    try {
      if (state.accessToken) {
        const userFetched = await dispatch('fetchUser')
        if (!userFetched) {
          const newToken = await dispatch('refreshToken')
          if (newToken) {
            await dispatch('fetchUser')
          }
        }
      } else {
        const newToken = await dispatch('refreshToken')
        if (newToken) {
          await dispatch('fetchUser')
        }
      }
    } catch (e) {
      console.log('Authentication initialization failed:', e)
      commit('clearAuth')
    } finally {
      commit('setAuthReady', true)
    }
  },
}

export const getters = {
  isAuthenticated: (state: RootState) => state.isAuthenticated,
  currentUser: (state: RootState) => state.user,
  accessToken: (state: RootState) => state.accessToken,
}

import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Store } from 'vuex'
import { RootState } from '~/store'

export default function ({ $axios, store, redirect }: { $axios: NuxtAxiosInstance; store: Store<RootState>; redirect: any }) {
  $axios.onRequest((config) => {
    if (store.getters.isAuthenticated && store.getters.accessToken) {
      config.headers.Authorization = `Bearer ${store.getters.accessToken}`
    }
    return config
  })

  $axios.onError(async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const newAccessToken = await store.dispatch('refreshToken')
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return $axios(originalRequest)
        } else {
          await store.dispatch('logout')
          return redirect('/login')
        }
      } catch (e) {
        console.error('Error during token refresh or retry:', e)
        await store.dispatch('logout')
        return redirect('/login')
      }
    }

    return Promise.reject(error)
  })
}

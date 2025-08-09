import { Middleware } from '@nuxt/types'

const guestMiddleware: Middleware = ({ store, redirect }) => {
  if (store.getters.isAuthenticated) {
    return redirect('/')
  }
}

export default guestMiddleware

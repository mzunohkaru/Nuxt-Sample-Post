import { Middleware } from '@nuxt/types'

const protectedRoutes = ['/', '/account']
const publicOnlyRoutes = ['/login']

function waitForAuthReady(store: any) {
  return new Promise<void>((resolve) => {
    if (store.state.authReady) {
      return resolve()
    }
    const unsubscribe = store.subscribe((mutation: any) => {
      if (mutation.type === 'setAuthReady' && mutation.payload) {
        unsubscribe()
        resolve()
      }
    })
  })
}

const authMiddleware: Middleware = async ({ store, route, redirect }) => {
  if (process.server) {
    return
  }

  await waitForAuthReady(store)

  const isAuthenticated = store.getters.isAuthenticated

  if (protectedRoutes.includes(route.path) && !isAuthenticated) {
    return redirect('/login')
  }

  if (publicOnlyRoutes.includes(route.path) && isAuthenticated) {
    return redirect('/')
  }
}

export default authMiddleware

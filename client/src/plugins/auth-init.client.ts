import { Store } from 'vuex'
import { RootState } from '~/store'

export default async function ({ store }: { store: Store<RootState> }) {
  await store.dispatch('initAuth')
}

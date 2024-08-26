import { StoreApi, UseBoundStore } from 'zustand'
export type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    // we need to return a () => store... rather than store() because store itself is a react hook and we cannot call it here.
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

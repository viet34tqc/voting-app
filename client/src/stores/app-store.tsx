import { AppStep } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import { create } from 'zustand'
import { createSelectors, initSocket, WithSelectors } from './utils'

type AppStore = {
  currentStep: AppStep
  setCurrentStep: (step: AppStep) => void
  initializeSocket: () => void
  accessToken: string
  setAccessToken: (token: string) => void
  socket?: Socket
}

export const useAppStoreBase = create<AppStore>((set, get) => ({
  currentStep: 'welcome',
  accessToken: '',
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
  setAccessToken: (token: string) => {
    set((state) => ({ ...state, accessToken: token }))
  },
  initializeSocket: () => {
    const socket = get().socket
    if (!socket) {
      set((state) => ({ ...state, socket: initSocket() }))
    } else {
      socket.connect()
    }
  },
}))

// I need to type anotation here because of the issue 'The inferred type of "X" cannot be named' in Socket io
export const useAppStore: WithSelectors<typeof useAppStoreBase> = createSelectors(useAppStoreBase)

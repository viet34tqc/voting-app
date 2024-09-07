import { initSocket } from '@/lib/initSocket'
import { AppStep } from '@/lib/types'
import { accessTokenConfig } from '@/lib/utils'
import type { Socket } from 'socket.io-client'
import { Poll } from 'voting-app-shared'
import { create } from 'zustand'
import { createSelectors, WithSelectors } from './utils'

export type AppStore = {
  currentStep: AppStep
  setCurrentStep: (step: AppStep) => void
  initSocket: () => void
  socket: Socket | null
  poll: Poll | null
  updatePoll: (poll: Poll) => void
  reset: () => void
}

const initialState = {
  currentStep: 'welcome' as const,
  accessToken: '',
  socket: null,
  poll: null,
}

export const useAppStoreBase = create<AppStore>((set, get) => ({
  ...initialState,
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
  updatePoll: (poll: Poll) => {
    set((state) => ({ ...state, poll }))
  },
  initSocket: () => {
    const socket = get().socket
    if (!socket) {
      set((state) => ({ ...state, socket: initSocket(state) }))
    } else {
      socket.connect()
    }
  },
  reset: () => {
    get().socket?.disconnect()
    accessTokenConfig.remove()
    set(initialState)
  },
}))

// I need to type anotation here because of the issue 'The inferred type of "X" cannot be named' in Socket io
export const useAppStore: WithSelectors<typeof useAppStoreBase>['use'] =
  createSelectors(useAppStoreBase).use

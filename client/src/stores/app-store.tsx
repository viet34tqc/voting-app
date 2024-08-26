import { initSocket } from '@/lib/initSocket'
import { AppStep } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import { Poll } from 'voting-app-shared'
import { create } from 'zustand'
import { createSelectors, WithSelectors } from './utils'

export type AppStore = {
  currentStep: AppStep
  setCurrentStep: (step: AppStep) => void
  initSocket: () => void
  accessToken: string
  setAccessToken: (token: string) => void
  socket?: Socket
  poll?: Poll
  updatePoll: (poll: Poll) => void
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
}))

// I need to type anotation here because of the issue 'The inferred type of "X" cannot be named' in Socket io
export const useAppStore: WithSelectors<typeof useAppStoreBase>['use'] =
  createSelectors(useAppStoreBase).use

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
  socket: Socket | null
  poll: Poll | null
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  updatePoll: (poll: Poll) => void
}

export const useAppStoreBase = create<AppStore>((set, get) => ({
  currentStep: 'welcome',
  accessToken: '',
  socket: null,
  poll: null,
  isAdmin: false,
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
  updatePoll: (poll: Poll) => {
    set((state) => ({ ...state, poll }))
  },
  setIsAdmin: (isAdmin: boolean) => {
    set((state) => ({ ...state, isAdmin }))
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

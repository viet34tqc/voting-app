import { getMe } from '@/apis/getMe'
import { toast } from '@/components/ui/toast/use-toast'
import { initSocket } from '@/lib/initSocket'
import { AppStep } from '@/lib/types'
import { accessTokenConfig } from '@/lib/utils'
import type { Socket } from 'socket.io-client'
import { Poll, User } from 'voting-app-shared'
import { create } from 'zustand'
import { createSelectors, WithSelectors } from './utils'

export type AppStore = {
  currentStep: AppStep
  currentUser: User | null
  setCurrentUser: () => void
  setCurrentStep: (step: AppStep) => void
  initSocket: () => void
  socket: Socket | null
  poll: Poll | null
  updatePoll: (poll: Poll) => void
  checkToRemoveUser: (updatedPoll: Poll) => void
  reset: () => void
}

const initialState = {
  currentStep: 'welcome' as const,
  currentUser: null,
  accessToken: '',
  socket: null,
  poll: null,
}

export const useAppStoreBase = create<AppStore>((set, get) => ({
  ...initialState,
  currentUser: null,
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
  async setCurrentUser() {
    try {
      const user = await getMe()
      if (user) {
        set((state) => ({ ...state, currentUser: user }))
      }
    } catch (error) {
      // token is expired, remove it
      accessTokenConfig.remove()
    }
  },
  updatePoll: (poll: Poll) => {
    set((state) => ({ ...state, poll }))
  },
  checkToRemoveUser: (updatedPoll: Poll) => {
    const currentPoll = get().poll
    const currentUser = get().currentUser

    if (!currentPoll || !currentUser) return
    if (
      currentPoll.participants[currentUser.userId] &&
      !updatedPoll.participants[currentUser.userId]
    ) {
      get().reset()
      toast({
        title: 'You have been kicked out of the poll',
      })
    }
  },
  initSocket: async () => {
    if (!get().currentUser) {
      await get().setCurrentUser()
    }
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

useAppStoreBase.getState().initSocket()

// I need to type anotation here because of the issue 'The inferred type of "X" cannot be named' in Socket io
export const useAppStore: WithSelectors<typeof useAppStoreBase>['use'] =
  createSelectors(useAppStoreBase).use

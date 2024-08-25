import { AppStep } from '@/lib/types'
import { create } from 'zustand'
import { createSelectors, initSocket } from './utils'

type AppStepsStore = {
  currentStep: AppStep
  setCurrentStep: (step: AppStep) => void
  initializeSocket: () => void
  accessToken: string
  setAccessToken: (token: string) => void
  socket?: any
}

export const useAppStoreBase = create<AppStepsStore>((set, get) => ({
  currentStep: 'welcome',
  accessToken: '',
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
  setAccessToken: (token: string) => {
    set((state) => ({ ...state, accessToken: token }))
  },
  initializeSocket: () => {
    if (!get().socket) {
      set((state) => ({ ...state, socket: initSocket() }))
    }
  },
}))

export const useAppStore = createSelectors(useAppStoreBase)

import { AppStep } from '@/lib/types'
import { createSelectors } from '@/lib/utils'
import { create } from 'zustand'

type AppStepsStore = {
  currentStep: AppStep
  setCurrentStep: (step: AppStep) => void
}

export const useAppStepsStoreBase = create<AppStepsStore>((set) => ({
  currentStep: 'welcome',
  setCurrentStep: (step: AppStep) => {
    set((state) => ({ ...state, currentStep: step }))
  },
}))

export const useAppStepsStore = createSelectors(useAppStepsStoreBase)

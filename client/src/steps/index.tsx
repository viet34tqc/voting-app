import useChangeStep from '@/hooks/useChangeStep'
import { stepsConfig } from '@/lib/stepsConfig'
import { useAppStore } from '@/stores/app-store'
import { Suspense } from 'react'

const Steps = () => {
  const currentStep = useAppStore.currentStep()
  const CurrentStepComponent = stepsConfig[currentStep]

  useChangeStep()

  return (
    <Suspense fallback='Loading...'>
      <CurrentStepComponent />
    </Suspense>
  )
}

export default Steps

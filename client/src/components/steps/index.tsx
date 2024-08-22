import { stepsConfig } from '@/lib/stepsConfig'
import { useAppStepsStore } from '@/stores/app-steps-store'
import { Suspense } from 'react'

const Steps = () => {
  const currentStep = useAppStepsStore.use.currentStep()

  const CurrentStepComponent = stepsConfig[currentStep]
  console.log('CurrentStepComponent', CurrentStepComponent)

  return (
    <Suspense fallback='Loading...'>
      <CurrentStepComponent />
    </Suspense>
  )
}

export default Steps

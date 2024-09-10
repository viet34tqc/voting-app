import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const Reconnect = () => {
  const currentPoll = useAppStore.poll()
  const setCurrentStep = useAppStore.setCurrentStep()

  useEffect(() => {
    if (currentPoll && !currentPoll?.hasStarted) {
      setCurrentStep('waitingRoom')
    }
  }, [currentPoll, setCurrentStep])

  return null
}
export default Reconnect

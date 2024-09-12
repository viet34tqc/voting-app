import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const Reconnect = () => {
  const currentPoll = useAppStore.poll()
  const currentUser = useAppStore.currentUser()
  const setCurrentStep = useAppStore.setCurrentStep()

  useEffect(() => {
    if (currentPoll && currentUser && !currentPoll?.hasStarted) {
      setCurrentStep('waitingRoom')
    }
  }, [currentPoll, currentUser, setCurrentStep])

  return null
}
export default Reconnect

import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const Reconnect = () => {
  const currentPoll = useAppStore.poll()
  const currentUser = useAppStore.currentUser()
  const setCurrentStep = useAppStore.setCurrentStep()

  useEffect(() => {
    if (!currentPoll || !currentUser) {
      return
    }

    if (!currentPoll.hasStarted) {
      setCurrentStep('waitingRoom')
    } else if (currentPoll.hasStarted) {
      setCurrentStep('voting')
    }
  }, [currentPoll, currentUser, setCurrentStep])

  return null
}
export default Reconnect

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
    }
    if (currentPoll.hasStarted) {
      setCurrentStep('voting')
    }
    if (currentPoll.votes[currentUser.userId]) {
      setCurrentStep('results')
    }
  }, [currentPoll, currentUser, setCurrentStep])

  return null
}
export default Reconnect

import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const useChangeStep = () => {
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
}

export default useChangeStep

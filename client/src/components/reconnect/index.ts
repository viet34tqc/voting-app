import { useGetMe } from '@/queries/useGetMe'
import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const Reconnect = () => {
  const { data: user, error } = useGetMe()
  const currentPoll = useAppStore.poll()
  const setCurrentStep = useAppStore.setCurrentStep()

  useEffect(() => {
    // There might be error when database is clear but user still has accessToken
    if (error) {
      localStorage.removeItem('accessToken')
      return
    }
    // If no error, but also no user, that means there is no access token
    if (!user) return
    if (!currentPoll?.hasStarted) {
      setCurrentStep('waitingRoom')
    }
  }, [user, currentPoll, error])

  return null
}
export default Reconnect

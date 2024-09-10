import { useGetMe } from '@/queries/use-get-me'
import { useAppStore } from '@/stores/app-store'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const Reconnect = () => {
  const queryClient = useQueryClient()
  const { data: user, error } = useGetMe()
  const currentPoll = useAppStore.poll()
  const setCurrentStep = useAppStore.setCurrentStep()

  const initSocket = useAppStore.initSocket()
  useEffect(() => {
    initSocket()
  }, [initSocket])

  useEffect(() => {
    // There might be error when database is clear but user still has accessToken
    if (error) {
      localStorage.removeItem('accessToken')
      // Need to remove query from cache, otherwise when we remove poll from database
      // Refresh the page, useGetMe is invoked and returns error.
      // Now, try to create new one immediately, the query cache returns error again and it runs into this block
      // And the access token is cleared immediately after it is created
      queryClient.removeQueries({ queryKey: ['me'] })
      return
    }
    // If no error, but also no user, that means there is no access token
    if (!user) return
    if (currentPoll && !currentPoll?.hasStarted) {
      setCurrentStep('waitingRoom')
    }
  }, [currentPoll, error, queryClient, setCurrentStep, user])

  return null
}
export default Reconnect

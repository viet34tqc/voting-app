import { useGetMe } from '@/queries/use-get-me'
import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

export const useIsAdmin = () => {
  const currentPoll = useAppStore.poll()
  const setIsAdmin = useAppStore.setIsAdmin()
  const { data: user } = useGetMe()

  useEffect(() => {
    if (!user || !currentPoll) return
    if (user.userId === currentPoll.adminId) {
      setIsAdmin(true)
    }
  }, [user, currentPoll])
  return null
}

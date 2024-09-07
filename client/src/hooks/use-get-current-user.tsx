import { useGetMe } from '@/queries/use-get-me'
import { useAppStore } from '@/stores/app-store'

export const useGetCurrentUser = () => {
  const currentPoll = useAppStore.poll()
  const { data: user } = useGetMe()

  if (!user || !currentPoll) return null
  return { ...user, isAdmin: user.userId === currentPoll.adminId }
}

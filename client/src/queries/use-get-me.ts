import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { User } from 'voting-app-shared'

async function getMe() {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return null
  return api.get<never, User>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })
}

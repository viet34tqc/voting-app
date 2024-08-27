import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

async function getMe() {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return null
  return api.get('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })
}

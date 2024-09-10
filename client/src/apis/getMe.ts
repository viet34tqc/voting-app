import api from '@/lib/api'
import { User } from 'voting-app-shared'

export async function getMe() {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return null
  return api.get<never, User>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

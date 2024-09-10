import { toast } from '@/components/ui/toast/use-toast'
import { AppStore } from '@/stores/app-store'
import { Socket, io } from 'socket.io-client'
import { Poll } from 'voting-app-shared'
import { accessTokenConfig } from './utils'

export const initSocket: (state: AppStore) => Socket | null = (state: AppStore) => {
  const accessToken = accessTokenConfig.get()
  const currentUser = state.currentUser
  if (!accessToken || !currentUser) return null
  const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('socket connected')
  })
  socket.on('connect_error', () => {
    toast({
      title: 'Connection Error',
      description: 'Failed to connect to server',
    })
  })
  socket.on('exception', (error) => {
    toast({
      title: 'Connection Error',
      description: error.message,
    })
  })

  // When there is a new participant, server updated the poll and send 'poll_updated' event to all clients
  // Then, we need to update the poll in the store
  socket.on('poll_updated', (poll: Poll) => {
    state.updatePoll(poll)
  })

  return socket
}

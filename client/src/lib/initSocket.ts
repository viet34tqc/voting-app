import { AppStore } from '@/stores/app-store'
import { Socket, io } from 'socket.io-client'
import { Poll } from 'voting-app-shared'

export const initSocket: (state: AppStore) => Socket = (state: AppStore) => {
  const socket = io(import.meta.env.VITE_API_SOCKET_URL, {
    auth: {
      token: state.accessToken,
    },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('socket connected')
  })

  // When there is a new participant, server updated the poll and send 'poll_updated' event to all clients
  // Then, we need to update the poll in the store
  socket.on('poll_updated', (poll: Poll) => {
    state.updatePoll(poll)
  })

  return socket
}

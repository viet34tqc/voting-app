import { useAppStore } from '@/stores/app-store'
import { useEffect } from 'react'

const WaitingRoom = () => {
  const initSocket = useAppStore.initSocket()
  useEffect(() => {
    initSocket()
  }, [])
  return <div>WaitingRoom</div>
}

export default WaitingRoom

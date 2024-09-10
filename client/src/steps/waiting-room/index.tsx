import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'
import { Copy, PenSquare } from 'lucide-react'
import { useEffect } from 'react'
import ParticipantSheet from './components/participants-button'
import { SubmitActions } from './components/submit-actions'

const copyPollId = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert('Poll ID copied to clipboard!'))
    .catch((err) => console.error('Failed to copy: ', err))
}

const WaitingRoom = () => {
  const currentPoll = useAppStore.poll()
  const currentUser = useAppStore.currentUser()

  const initSocket = useAppStore.initSocket()
  useEffect(() => {
    if (!currentUser) {
      initSocket()
    }
  }, [initSocket, currentUser])

  if (!currentUser) return <div>Failed to load user</div>

  if (!currentPoll) return <div>There is no poll. There might be an error</div>

  const participants = currentPoll.participants
  const pollId = currentPoll.id
  return (
    <div className='shadow-lg rounded-lg overflow-auto'>
      <div className='p-6 space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800'>Poll Topic</h2>
          <p className='text-gray-600 italic'>{currentPoll.topic}</p>
        </div>

        <div className='space-y-2'>
          <p className='text-gray-700 font-semibold'>Poll ID</p>
          <Button
            variant='ghost'
            className='flex items-center w-full justify-between bg-gray-100 p-2 rounded'
            onClick={() => copyPollId(pollId)}
          >
            <span className='text-gray-800 font-mono'>{pollId}</span>
            <Copy className='h-4 w-4' />
            <span className='sr-only'>Copy Poll ID</span>
          </Button>
        </div>

        <div className='flex justify-center space-x-4'>
          <ParticipantSheet participants={participants} />
          <div className='bg-blue-100 text-blue-600 p-3 rounded-lg text-center'>
            <PenSquare className='h-6 w-6 mx-auto' />
            <span className='block mt-1 font-semibold'>0</span>
          </div>
        </div>

        <SubmitActions />
      </div>
    </div>
  )
}

export default WaitingRoom

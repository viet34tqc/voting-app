import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'
import { Copy } from 'lucide-react'
import { NominationsDrawer } from './components/nominations-drawer'
import ParticipantDrawer from './components/participants-drawer'
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

  if (!currentUser) return <div>Failed to load user</div>

  if (!currentPoll) return <div>There is no poll. There might be an error</div>

  const participants = currentPoll.participants
  const nominations = currentPoll.nominations
  const pollId = currentPoll.id
  return (
    <div className='page-animation shadow-lg rounded-lg overflow-auto p-6 space-y-6 text-center w-96 max-w-full'>
      <div>
        <h2 className='text-2xl font-bold text-gray-800'>Poll Topic</h2>
        <p className='text-gray-600 italic'>{currentPoll.topic}</p>
      </div>

      <div className='space-y-2'>
        <p className='text-left text-gray-700 font-semibold'>Poll ID</p>
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
        <ParticipantDrawer participants={participants} />
        <NominationsDrawer nominations={nominations} />
      </div>

      <SubmitActions />
    </div>
  )
}

export default WaitingRoom

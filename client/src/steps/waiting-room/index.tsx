import { Button } from '@/components/ui/button'
import { useIsAdmin } from '@/hooks/use-is-admin'
import { useAppStore } from '@/stores/app-store'
import { Copy, PenSquare, Users } from 'lucide-react'
import { useEffect } from 'react'

const copyPollId = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert('Poll ID copied to clipboard!'))
    .catch((err) => console.error('Failed to copy: ', err))
}

const WaitingRoom = () => {
  const currentPoll = useAppStore.poll()
  const isAdmin = useAppStore.isAdmin()

  const initSocket = useAppStore.initSocket()
  useEffect(() => {
    initSocket()
  }, [])

  useIsAdmin()

  if (!currentPoll) return 'There is no poll. There might be an error'

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
            onClick={() => copyPollId(currentPoll.id)}
          >
            <span className='text-gray-800 font-mono'>{currentPoll.id}</span>
            <Copy className='h-4 w-4' />
            <span className='sr-only'>Copy Poll ID</span>
          </Button>
        </div>

        <div className='flex justify-center space-x-4'>
          <div className='bg-red-100 text-red-600 p-3 rounded-lg text-center'>
            <Users className='h-6 w-6 mx-auto' />
            <span className='block mt-1 font-semibold'>0</span>
          </div>
          <div className='bg-blue-100 text-blue-600 p-3 rounded-lg text-center'>
            <PenSquare className='h-6 w-6 mx-auto' />
            <span className='block mt-1 font-semibold'>0</span>
          </div>
        </div>

        {isAdmin ? (
          <>
            <p className='italic'>{currentPoll.votesPerVoter} Nominations Required to Start!</p>
            <div className='space-y-3'>
              <Button className='w-full' variant='outline'>
                Start Voting
              </Button>
              <Button className='w-full' variant='secondary'>
                Leave Poll
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* User is connecting but admin is disconnect */}
            {currentPoll.participants[currentPoll.adminId] ? (
              <p className='italic'>
                Waiting for Admin,{' '}
                <span className='font-semibold'>
                  {currentPoll.participants[currentPoll.adminId]}
                </span>
                , to start the voting.
              </p>
            ) : (
              <p className='italic'>Admin is disconnect, please wait him to return</p>
            )}
            <Button className='w-full' variant='secondary'>
              Leave Poll
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default WaitingRoom

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'

const Results = () => {
  const currentPoll = useAppStore.poll()
  const currentUser = useAppStore.currentUser()
  if (!currentUser || !currentPoll) return <div>Failed to load user or poll</div>

  return (
    <div className='shadow-lg rounded-lg overflow-auto p-6 space-y-6 text-center w-96 max-w-full'>
      <div>
        <h1 className='text-2xl font-bold'>Poll Results</h1>
        <p className='text-xl mt-2'>{currentPoll.topic}</p>
      </div>

      <p>
        {Object.keys(currentPoll.votes).length} of {Object.keys(currentPoll.participants).length}{' '}
        participants have voted
      </p>

      <div className='space-y-4'>
        <h2 className='text-xl text-left font-semibold'>Participant Status</h2>
        <div className='grid grid-cols-2 gap-4'>
          {Object.entries(currentPoll.participants).map(([id, participantName]) => (
            <div key={id} className='flex items-center space-x-2 p-2 bg-gray-100 rounded-lg'>
              <div
                className={`w-3 h-3 rounded-full ${Object.keys(currentPoll.votes).includes(id) ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <span>{participantName}</span>
            </div>
          ))}
        </div>
      </div>

      {currentPoll.adminId === currentUser.userId ? (
        <Button className='w-full bg-red-500 hover:bg-red-600 text-white'>End Poll</Button>
      ) : (
        <p className='italic'>
          Waiting for admin,{' '}
          <span className='font-semibold'>{currentPoll.participants[currentPoll.adminId]}</span>, to
          end poll
        </p>
      )}
    </div>
  )
}

export default Results

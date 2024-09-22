import { Award } from 'lucide-react'
import { Poll } from 'voting-app-shared'
import { LeavePollConfirmation } from '../waiting-room/components/submit-actions/leave-poll-confirmation'

const FinalResults = ({ currentPoll }: { currentPoll: Poll }) => {
  return (
    <>
      <div className='text-center'>
        <h2 className='text-2xl font-bold'>Final Results</h2>
        <p className='text-xl mt-2'>{currentPoll.topic}</p>
      </div>
      <div className='space-y-2'>
        {currentPoll.results.map((result, index) => (
          <div className='bg-gray-100 rounded-lg p-4 space-y-1' key={result.nominationId}>
            <div className='flex justify-between items-center'>
              <div className='font-medium flex items-center'>
                {index === 0 && <Award className='h-5 w-5 text-yellow-500 mr-2' />}
                {result.nominationText}
              </div>
              <span className='text-sm text-gray-600'>{result.score} points</span>
            </div>
          </div>
        ))}
      </div>
      <LeavePollConfirmation />
    </>
  )
}

export default FinalResults

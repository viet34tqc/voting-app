import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast/use-toast'
import { useAppStore } from '@/stores/app-store'
import { useState } from 'react'
import { NominationId } from 'voting-app-shared'
import { SubmitActions } from './submit-actions'

const VotingPage = () => {
  const currentPoll = useAppStore.poll()
  const [selectedNominations, setSelectedNominations] = useState<NominationId[]>([])

  if (!currentPoll) return <div>There is no poll. There might be an error</div>

  const canSubmitVote = selectedNominations.length === currentPoll.votesPerVoter
  const remainingVotes = currentPoll.votesPerVoter - selectedNominations.length

  const handleNominate = (nominationId: NominationId) => {
    if (selectedNominations.includes(nominationId)) {
      setSelectedNominations(selectedNominations.filter((id) => id !== nominationId))
    } else {
      if (remainingVotes === 0) {
        toast({
          title: 'Vote limit reached',
          description:
            'You have reached the vote limit. You can only select ' +
            currentPoll.votesPerVoter +
            ' nomination(s)',
        })
        return
      }
      setSelectedNominations([...selectedNominations, nominationId])
    }
  }

  return (
    <div className='page-animation shadow-lg rounded-lg overflow-auto p-6 space-y-6 text-center w-96 max-w-full'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800'>Voting page</h1>
        <p className='text-gray-600 italic'>
          Select your top {currentPoll.votesPerVoter} choice(s)
        </p>
      </div>

      <p className='font-semibold'>{remainingVotes} vote(s) remaining</p>
      <div className='flex flex-col gap-2'>
        {Object.entries(currentPoll.nominations).map(([nominationId, nomination]) => {
          const index = selectedNominations.indexOf(nominationId)
          return (
            <Button
              key={nominationId}
              className='justify-between items-center p-2 h-auto bg-gray-100 rounded-md'
              variant='ghost'
              onClick={() => handleNominate(nominationId)}
            >
              <div className='flex flex-col justify-between items-start mb-1'>
                <span className='font-medium'>{nomination.text}</span>
                <p className='text-sm text-left text-gray-600'>
                  Nominated by: {nomination.userName}
                </p>
              </div>

              {index !== -1 ? (
                <p className='rounded-full bg-blue-400 text-white text-xs w-6 h-6 grid place-items-center'>
                  {index + 1}
                </p>
              ) : null}
            </Button>
          )
        })}
      </div>

      <SubmitActions canSubmitVote={canSubmitVote} selectedNominations={selectedNominations} />
    </div>
  )
}

export default VotingPage

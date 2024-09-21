import { Button } from '@/components/ui/button'
import CancelPollConfirmation from '@/steps/waiting-room/components/submit-actions/cancel-poll'
import { LeavePollConfirmation } from '@/steps/waiting-room/components/submit-actions/leave-poll-confirmation'
import { useAppStore } from '@/stores/app-store'
import { NominationId } from 'voting-app-shared'

export const SubmitActions = ({
  canSubmitVote,
  selectedNominations,
}: {
  canSubmitVote: boolean
  selectedNominations: NominationId[]
}) => {
  const currentUser = useAppStore.currentUser()
  const currentPoll = useAppStore.poll()
  const socket = useAppStore.socket()

  if (!currentUser || !currentPoll) return null

  return (
    <div className='space-y-3'>
      {!currentPoll.participants[currentPoll.adminId] && (
        <p className='italic'>Admin is disconnect, please wait him to return</p>
      )}
      <Button
        className='w-full'
        variant='outline'
        disabled={!canSubmitVote}
        onClick={() => socket?.emit('vote', { votes: selectedNominations })}
      >
        Submit voting
      </Button>
      {currentUser.isAdmin ? <CancelPollConfirmation /> : <LeavePollConfirmation />}
    </div>
  )
}

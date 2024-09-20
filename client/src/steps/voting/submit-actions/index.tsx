import { Button } from '@/components/ui/button'
import CancelPollConfirmation from '@/steps/waiting-room/components/submit-actions/cancel-poll'
import { LeavePollConfirmation } from '@/steps/waiting-room/components/submit-actions/leave-poll-confirmation'
import { useAppStore } from '@/stores/app-store'

export const SubmitActions = () => {
  const currentUser = useAppStore.currentUser()
  const currentPoll = useAppStore.poll()

  if (!currentUser || !currentPoll) return null

  const participants = currentPoll.participants
  const nominations = currentPoll.nominations
  const canStartVote = Object.keys(nominations).length >= currentPoll.votesPerVoter

  return currentUser.isAdmin ? (
    <div className='space-y-3'>
      <Button className='w-full' variant='outline' disabled={!canStartVote}>
        Submit voting
      </Button>
      <CancelPollConfirmation />
    </div>
  ) : (
    <>
      {/* User is connecting but admin is disconnect */}
      {participants[currentPoll.adminId] ? (
        <p className='italic'>
          Waiting for Admin,{' '}
          <span className='font-semibold'>{participants[currentPoll.adminId]}</span>, to start the
          voting.
        </p>
      ) : (
        <p className='italic'>Admin is disconnect, please wait him to return</p>
      )}
      <LeavePollConfirmation />
    </>
  )
}

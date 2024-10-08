import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'
import CancelPollConfirmation from './cancel-poll'
import { LeavePollConfirmation } from './leave-poll-confirmation'

export const SubmitActions = () => {
  const currentUser = useAppStore.currentUser()
  const currentPoll = useAppStore.poll()
  const socket = useAppStore.socket()

  if (!currentUser || !currentPoll) return null

  const participants = currentPoll.participants
  const nominations = currentPoll.nominations
  const canStartVote = Object.keys(nominations).length >= currentPoll.votesPerVoter

  return currentUser.isAdmin ? (
    <>
      <p className='italic'>{currentPoll.votesPerVoter} Nominations Required to Start!</p>
      <div className='space-y-3'>
        <Button
          className='w-full'
          variant='outline'
          disabled={!canStartVote}
          onClick={() => socket?.emit('start_poll')}
        >
          Start Voting
        </Button>
        <CancelPollConfirmation />
      </div>
    </>
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

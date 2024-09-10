import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app-store'
import { UserMinus } from 'lucide-react'

const RemoveParticipantDialog = ({ participantId }: { participantId: string }) => {
  const currentUser = useAppStore.currentUser()
  const currentPoll = useAppStore.poll()
  const socket = useAppStore.socket()
  if (!currentUser || !currentUser.isAdmin) return null

  // Admin can't remove himself
  if (currentPoll?.adminId === participantId) return null

  const removeParticipant = () => {
    socket?.emit('remove_participant', { id: participantId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <UserMinus className='h-4 w-4 text-red-500' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to remove this participant?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You can still reconnect to the poll via poll ID.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeParticipant}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveParticipantDialog

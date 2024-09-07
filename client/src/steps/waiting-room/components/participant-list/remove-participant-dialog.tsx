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
import { useGetCurrentUser } from '@/hooks/use-get-current-user'
import { useAppStore } from '@/stores/app-store'
import { UserMinus } from 'lucide-react'

const RemoveParticipantDialog = ({ participantId }: { participantId: string }) => {
  const currentUser = useGetCurrentUser()
  const currentPoll = useAppStore.poll()
  if (!currentUser || !currentUser.isAdmin) return null

  // Admin can't remove himself
  if (currentPoll?.adminId === participantId) return null
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
          <AlertDialogAction>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default RemoveParticipantDialog

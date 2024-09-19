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
import { CircleX } from 'lucide-react'

const DeleteNominationConfirmation = ({ nominationId }: { nominationId: string }) => {
  const currentUser = useAppStore.currentUser()
  const socket = useAppStore.socket()
  if (!currentUser || !currentUser.isAdmin) return null

  const removeNomination = () => {
    socket?.emit('remove_nomination', { id: nominationId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='ghost' size='sm'>
          <CircleX className='h-4 w-4 text-red-500' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to remove this nomination?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={removeNomination}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteNominationConfirmation

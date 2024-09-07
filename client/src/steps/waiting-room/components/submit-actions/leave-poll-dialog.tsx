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

export const LeavePollDialog = () => {
  const reset = useAppStore.reset()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full' variant='secondary'>
          Leave Poll
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to leave this poll?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You can still reconnect to the poll via poll ID.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={reset}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

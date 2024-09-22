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
import { buttonVariants } from '@/components/ui/button/buttonVariants'
import { useAppStore } from '@/stores/app-store'

export const LeavePollConfirmation = () => {
  const reset = useAppStore.reset()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='w-full'>Leave Poll</Button>
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
          <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={reset}>
            Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

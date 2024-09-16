import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import NewNominationForm from './new-nomination-form'

const NewNominationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Nomination</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add nomination</DialogTitle>
        </DialogHeader>
        <NewNominationForm />
      </DialogContent>
    </Dialog>
  )
}

export default NewNominationDialog

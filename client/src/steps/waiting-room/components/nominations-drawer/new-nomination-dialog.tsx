import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import NewNominationForm from './new-nomination-form'

const NewNominationDialog = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Nomination</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add nomination</DialogTitle>
        </DialogHeader>
        <NewNominationForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default NewNominationDialog

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PenSquare } from 'lucide-react'
import { Nominations } from 'voting-app-shared'
import NewNominationDialog from './new-nomination-dialog'

export const NominationsDrawer = ({ nominations }: { nominations: Nominations }) => {
  const nominationsLength = Object.keys(nominations).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className='bg-blue-100 text-blue-600 p-3 rounded-lg text-center h-auto flex flex-col'
          variant={'ghost'}
        >
          <PenSquare className='h-6 w-6 mx-auto' />
          <span className='block mt-1 font-semibold'>{nominationsLength}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col gap-3'>
        <SheetHeader>
          <SheetTitle>Nominations</SheetTitle>
        </SheetHeader>
        <NewNominationDialog />
      </SheetContent>
    </Sheet>
  )
}

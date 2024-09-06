import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Users } from 'lucide-react'
import { Participants } from 'voting-app-shared'

const ParticipantButton = ({ participants }: { participants: Participants }) => {
  const participantsLenght = Object.keys(participants).length
  /*
   * Why I'm using Sheet instead of Dialog?
   * We can have a long list of participants, so sheets is a better choice.
   * There are more room for us when using Sheet
   */
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className='bg-red-100 text-red-600 p-3 rounded-lg text-center h-auto flex flex-col'
          variant={'ghost'}
        >
          <Users className='h-6 w-6 mx-auto' />
          <span className='block mt-1 font-semibold'>{participantsLenght}</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Participants</SheetTitle>
          {participantsLenght === 0 ? 'No participants yet' : ''}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default ParticipantButton

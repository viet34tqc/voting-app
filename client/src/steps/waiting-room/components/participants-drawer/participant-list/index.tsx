import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Participants } from 'voting-app-shared'
import RemoveParticipantDialog from './remove-participant-dialog'

const ParticipantList = ({ participants }: { participants: Participants }) => {
  const participantsLength = Object.keys(participants).length
  const [searchTerm, setSearchTerm] = useState('')

  if (!participantsLength) return <div>No participants yet</div>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParticipants = Object.entries(participants).filter(([_, name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  return (
    <div className='space-y-4 mt-4'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        <Input
          type='text'
          placeholder='Search participants'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>
      <ul className='space-y-2'>
        {filteredParticipants.map(([id, name]) => (
          <li
            key={id}
            className='flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md'
          >
            <span className='truncate'>{name}</span>
            <RemoveParticipantDialog participantId={id} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ParticipantList

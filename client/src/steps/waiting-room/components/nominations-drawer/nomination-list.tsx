import { Nominations } from 'voting-app-shared'
import DeleteNominationConfirmation from './delete-nomination-confirmation'

const NominationList = ({ nominations }: { nominations: Nominations }) => {
  return (
    <ul className='space-y-2'>
      {Object.entries(nominations).map(([nominationId, nomination]) => (
        <li key={nominationId} className='p-2 bg-gray-100 rounded-md'>
          <div className='flex justify-between items-start mb-1'>
            <span className='font-medium'>{nomination.text}</span>
            <DeleteNominationConfirmation nominationId={nominationId} />
          </div>
          <div className='text-sm text-gray-600'>Nominated by: {nomination.userName}</div>
        </li>
      ))}
    </ul>
  )
}

export default NominationList

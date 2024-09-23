import { useAppStore } from '@/stores/app-store'
import FinalResults from './final-results'
import WaitingScreen from './waiting-screen'

const Results = () => {
  const currentPoll = useAppStore.poll()
  const currentUser = useAppStore.currentUser()
  if (!currentUser || !currentPoll) return <div>Failed to load user or poll</div>

  const finalResults = currentPoll.results

  return (
    <div className='page-animation shadow-lg rounded-lg overflow-auto p-6 space-y-6 text-center w-96 max-w-full'>
      {finalResults.length === 0 ? (
        <WaitingScreen currentPoll={currentPoll} currentUser={currentUser} />
      ) : (
        <FinalResults currentPoll={currentPoll} />
      )}
    </div>
  )
}

export default Results

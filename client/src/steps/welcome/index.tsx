import { Button } from '@/components/ui/button/button'
import { useAppStore } from '@/stores/app-store'

const Welcome = () => {
  const setCurrentStep = useAppStore.setCurrentStep()
  return (
    <section className='flex flex-col items-center gap-6 justify-center'>
      <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>PollPro</h1>
      <p className='max-w-[600px] text-muted-foreground md:text-xl'>
        Our voting app makes it easy for everyone to participate in the democratic process. Create
        new polls, join existing ones, and stay informed on election results.
      </p>
      <div className='flex flex-col gap-2 min-[400px]:flex-row justify-center'>
        <Button onClick={() => setCurrentStep('createPoll')}>Create New Poll</Button>
        <Button variant={'secondary'} onClick={() => setCurrentStep('joinPoll')}>
          Join Existing Poll
        </Button>
      </div>
    </section>
  )
}

export default Welcome

import './App.css'
import { Button } from './components/ui/button/button'

function App() {
  return (
    <main className='container grid place-content-center min-h-[100dvh]'>
      <section className='flex flex-col items-center gap-6 justify-center'>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
          PollPro
        </h1>
        <p className='max-w-[600px] text-muted-foreground md:text-xl'>
          Our voting app makes it easy for everyone to participate in the democratic process. Create
          new polls, join existing ones, and stay informed on election results.
        </p>
        <div className='flex flex-col gap-2 min-[400px]:flex-row justify-center'>
          <Button>Create New Poll</Button>
          <Button>Join Existing Poll</Button>
        </div>
      </section>
    </main>
  )
}

export default App

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/join')({
  component: JoinPoll,
})

function JoinPoll() {
  return <div>Join Poll</div>
}

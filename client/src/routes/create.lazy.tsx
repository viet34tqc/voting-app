import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/create')({
  component: CreatePoll,
})

function CreatePoll() {
  return <div>Create Poll</div>
}

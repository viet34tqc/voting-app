import { lazy, LazyExoticComponent } from 'react'

const Welcome = lazy(() => import('@/steps/welcome'))
const CreatePoll = lazy(() => import('@/steps/create-poll'))
const JoinPoll = lazy(() => import('@/steps/join-poll'))
const WaitingRoom = lazy(() => import('@/steps/waiting-room'))
const Voting = lazy(() => import('@/steps/voting'))
const Results = lazy(() => import('@/steps/results'))

export const stepsConfig: Record<string, LazyExoticComponent<() => JSX.Element>> = {
  welcome: Welcome,
  createPoll: CreatePoll,
  joinPoll: JoinPoll,
  waitingRoom: WaitingRoom,
  voting: Voting,
  results: Results,
}

export type AppStep = keyof typeof stepsConfig

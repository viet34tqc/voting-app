import { lazy, LazyExoticComponent } from 'react'
import { AppStep } from './types'

const Welcome = lazy(() => import('@/steps/welcome'))
const CreatePoll = lazy(() => import('@/steps/create-poll'))
const JoinPoll = lazy(() => import('@/steps/join-poll'))
const WaitingRoom = lazy(() => import('@/steps/waiting-room'))

export const stepsConfig: Record<AppStep, LazyExoticComponent<() => JSX.Element>> = {
  welcome: Welcome,
  createPoll: CreatePoll,
  joinPoll: JoinPoll,
  waitingRoom: WaitingRoom,
}

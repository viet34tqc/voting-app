import { lazy, LazyExoticComponent } from 'react'
import { AppStep } from './types'

const Welcome = lazy(() => import('@/components/steps/welcome'))
const CreatePoll = lazy(() => import('@/components/steps/create-poll'))
const JoinPoll = lazy(() => import('@/components/steps/join-poll'))

export const stepsConfig: Record<AppStep, LazyExoticComponent<() => JSX.Element>> = {
  welcome: Welcome,
  createPoll: CreatePoll,
  joinPoll: JoinPoll,
}

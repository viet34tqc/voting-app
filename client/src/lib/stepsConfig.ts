import { lazy, LazyExoticComponent } from 'react'
import { AppStep } from './types'

const Welcome = lazy(() => import('@/components/steps/Welcome'))
const CreatePoll = lazy(() => import('@/components/steps/CreatePoll'))
const JoinPoll = lazy(() => import('@/components/steps/JoinPoll'))

export const stepsConfig: Record<AppStep, LazyExoticComponent<() => JSX.Element>> = {
  welcome: Welcome,
  createPoll: CreatePoll,
  joinPoll: JoinPoll,
}

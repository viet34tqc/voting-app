import { Poll } from 'voting-app-shared'

export type AppStep = 'welcome' | 'createPoll' | 'joinPoll' | 'waitingRoom'
export type PollWithToken = Poll & { accessToken: string }

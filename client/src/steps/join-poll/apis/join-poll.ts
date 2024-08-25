import api from '@/lib/api'
import { PollWithToken } from '@/lib/types'
import { JoinPollFields } from '../form-schema'
export const joinPoll = async (data: JoinPollFields) =>
  api.post<never, PollWithToken>('/polls/join', data)

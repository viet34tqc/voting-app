import api from '@/lib/api'
import { PollWithToken } from '@/lib/types'
import { CreatePollFields } from '../form-schema'

export const createPoll = async (data: CreatePollFields) =>
  api.post<never, PollWithToken>('/polls/create', data)

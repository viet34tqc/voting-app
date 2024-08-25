import api from '@/lib/api'
import { JoinPollFields } from '../form-schema'
export const joinPoll = async (data: JoinPollFields) => api.post('/polls/join', data)

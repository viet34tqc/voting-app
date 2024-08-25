import api from '@/lib/api'
import { CreatePollFields } from '../form-schema'

export const createPoll = async (data: CreatePollFields) => api.post('/polls/create', data)

import api from '@/lib/api'
import { CreatePollFields } from '../formSchema'

export const createPoll = async (data: CreatePollFields) => api.post('/polls/create', data)

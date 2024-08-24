import { useMutation } from '@tanstack/react-query'
import { createPoll } from '../apis/createPoll'

export const useCreatePoll = () => {
  return useMutation({
    mutationFn: createPoll,
  })
}

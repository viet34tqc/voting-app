import { useMutation } from '@tanstack/react-query'
import { createPoll } from '../apis/create-poll'

export const useCreatePoll = () => {
  return useMutation({
    mutationFn: createPoll,
  })
}

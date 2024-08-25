import { useMutation } from '@tanstack/react-query'
import { joinPoll } from '../apis/join-poll'

export const useJoinPoll = () => {
  return useMutation({
    mutationFn: joinPoll,
  })
}

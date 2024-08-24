import { z } from 'zod'

export const joinPollSchema = z.object({
  pollId: z.string().min(1, { message: 'Please enter the poll ID' }),
  userName: z.string().min(1, { message: 'Please enter your name' }),
})

export type JoinPollFields = z.infer<typeof joinPollSchema>

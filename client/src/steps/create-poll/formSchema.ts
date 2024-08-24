import { z } from 'zod'

export const createPollSchema = z.object({
  topic: z.string().min(1, { message: 'Please enter a poll topic' }),
  votesPerVoter: z.coerce
    .number({ invalid_type_error: 'Please enter the number of votes per voter' })
    .min(1, { message: 'Number of votes must be greater than 0' })
    .max(5, { message: 'Number of votes must be less than 6' }),
  userName: z.string().min(1, { message: 'Please enter your name' }),
})

export type CreatePollFields = z.infer<typeof createPollSchema>

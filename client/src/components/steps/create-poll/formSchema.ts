import { z } from 'zod'

export const createPollSchema = z.object({
  pollTopic: z.string().min(1, { message: 'Please enter a poll topic' }),
  votesPerVoter: z.coerce
    .number({ invalid_type_error: 'Please entfdsfsr of votes per voter' })
    .min(1, { message: 'Please enter the number of votes per voter' }),
  userName: z.string().min(1, { message: 'Please enter your name' }),
})

export type CreatePollFields = z.infer<typeof createPollSchema>

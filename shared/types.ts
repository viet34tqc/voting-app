export type Participants = {
  [participantID: string]: string
}

export type Poll = {
  id: string
  topic: string
  votesPerVoter: number
  participants: Participants
  adminID: string
  // We use this flag to lock the user so he can not leave the poll when the poll has started
  hasStarted: boolean
}

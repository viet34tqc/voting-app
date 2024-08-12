export type Participants = {
  [participantID: string]: string
}

export type Nomination = {
  userId: string
  text: string
}

export type Nominations = {
  [nominationId: string]: Nomination
}

export type Poll = {
  id: string
  topic: string
  votesPerVoter: number
  participants: Participants
  nominations: Nominations
  adminId: string
  // We use this flag to lock the user so he can not leave the poll when the poll has started
  hasStarted: boolean
}

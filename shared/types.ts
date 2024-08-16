export type Participants = {
  [participantID: string]: string
}

export type Nomination = {
  userId: string
  text: string
}

export type NominationId = string

export type Nominations = {
  [nominationId: NominationId]: Nomination
}

export type Votes = {
  [userId: string]: NominationId[]
}

export type Results = Array<{
  nominationId: NominationId
  nominationText: string
  score: number
}>

export type Poll = {
  id: string
  topic: string
  votesPerVoter: number
  participants: Participants
  nominations: Nominations
  votes: Votes
  results: Results
  adminId: string
  // We use this flag to lock the user so he can not leave the poll when the poll has started
  hasStarted: boolean
}

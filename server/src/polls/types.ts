// repository types
export type CreatePollData = {
  pollId: string;
  topic: string;
  votesPerVoter: number;
  userId: string;
};

export type AddParticipantData = {
  pollId: string;
  userId: string;
  name: string;
};

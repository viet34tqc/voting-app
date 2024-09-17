import { Request } from 'express';
import { Socket } from 'socket.io';
import { Nomination, NominationId } from 'voting-app-shared';
import { RejoinPollDto } from './dto/rejoin-poll.dto';

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
  userName: string;
};

export type AddNominationData = {
  pollId: string;
  nominationId: string;
  nomination: Nomination;
};

export type AddNominationField = {
  pollId: string;
  userId: string;
  userName: string;
  text: string;
};

export type voteNominationsData = {
  pollId: string;
  userId: string;
  votes: NominationId[];
};

// We are adding the AuthPayload to the Request type so that we can use it in the guards
export type RequestWithAuth = Request & RejoinPollDto;
export type SocketWithAuth = Socket & RejoinPollDto;

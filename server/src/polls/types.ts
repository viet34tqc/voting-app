import { Request } from 'express';
import { RejoinPollDto } from './dto/rejoin-poll.dto';
import { Socket } from 'socket.io';

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

// We are adding the AuthPayload to the Request type so that we can use it in the guards
export type RequestWithAuth = Request & RejoinPollDto;
export type SocketWithAuth = Socket & RejoinPollDto;

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { RejoinPollDto } from './dto/rejoin-poll.dto';
import { PollsRepository } from './polls.repository';
import {
  AddNominationField,
  AddParticipantData,
  AddParticipantRankingsData,
} from './types';
import { createNominationId, createPollId, createUserId } from './utils';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPollDto: CreatePollDto) {
    const pollId = createPollId();
    const userId = createUserId();

    const createdPoll = await this.pollsRepository.createPoll({
      ...createPollDto,
      pollId,
      userId,
    });

    this.logger.debug(
      `Creating token string for pollId: ${createdPoll.id} and userID: ${userId}`,
    );

    const accessToken = this.jwtService.sign(
      {
        pollId: createdPoll.id,
        name: createPollDto.name,
      },
      {
        // This is optional but it's recommended to use it to adapt to JWT standards
        subject: userId,
      },
    );

    return {
      poll: createdPoll,
      accessToken,
    };
  }

  async join(joinPollDto: JoinPollDto) {
    const userId = createUserId();
    this.logger.debug(
      `Fetching poll with ID: ${joinPollDto.pollId} for user with ID: ${userId}`,
    );
    const joinedPoll = await this.pollsRepository.getPoll(joinPollDto.pollId);
    const accessToken = this.jwtService.sign(
      {
        pollId: joinedPoll.id,
        name: joinPollDto.name,
      },
      {
        subject: userId,
      },
    );
    return {
      poll: joinedPoll,
      accessToken,
    };
  }

  async rejoin(rejoinDto: RejoinPollDto) {
    this.logger.debug(
      `Rejoining poll with ID: ${rejoinDto.pollId} for user with Id: ${rejoinDto.userId} with name: ${rejoinDto.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(rejoinDto);

    return joinedPoll;
  }

  addParticipant(addParticipant: AddParticipantData) {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  addNomination({ pollId, userId, text }: AddNominationField) {
    return this.pollsRepository.addNomination({
      pollId,
      nomination: {
        userId,
        text,
      },
      nominationId: createNominationId(),
    });
  }

  async removeParticipant(pollId: string, userId: string) {
    const poll = await this.pollsRepository.getPoll(pollId);

    // Only remove if the poll hasn't started yet
    if (!poll.hasStarted) {
      return this.pollsRepository.removeParticipant(pollId, userId);
    }
  }

  async removeNomination(pollId: string, nominationId: string) {
    return this.pollsRepository.removeNomination(pollId, nominationId);
  }

  async getPoll(pollId: string) {
    return this.pollsRepository.getPoll(pollId);
  }

  async startPoll(pollId: string) {
    return this.pollsRepository.startPoll(pollId);
  }

  async addParticipantRankings(rankingsData: AddParticipantRankingsData) {
    const hasPollStarted = this.pollsRepository.getPoll(rankingsData.pollId);

    if (!hasPollStarted) {
      throw new BadRequestException(
        'Participants cannot rank until the poll has started.',
      );
    }

    return this.pollsRepository.addParticpantRankings(rankingsData);
  }
}

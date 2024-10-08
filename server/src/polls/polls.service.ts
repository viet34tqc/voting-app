import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { PollsRepository } from './polls.repository';
import {
  AddNominationField,
  AddParticipantData,
  voteNominationsData,
} from './types';
import {
  createNominationId,
  createPollId,
  createUserId,
  getResults,
} from './utils';

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
        userName: createPollDto.userName,
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
    if (joinedPoll?.hasStarted) {
      throw new BadRequestException('The poll has already started');
    }
    const accessToken = this.jwtService.sign(
      {
        pollId: joinedPoll.id,
        userName: joinPollDto.userName,
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

  addParticipant(addParticipant: AddParticipantData) {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  addNomination({ pollId, userId, userName, text }: AddNominationField) {
    return this.pollsRepository.addNomination({
      pollId,
      nomination: {
        userId,
        userName,
        text,
      },
      nominationId: createNominationId(),
    });
  }

  async removeParticipant(pollId: string, userId: string) {
    const poll = await this.pollsRepository.getPoll(pollId);

    // Only remove if the poll hasn't started yet
    if (!poll?.hasStarted) {
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

  async voteNominations(votesData: voteNominationsData) {
    const votingPoll = await this.pollsRepository.getPoll(votesData.pollId);

    if (!votingPoll.hasStarted) {
      throw new BadRequestException(
        'Participants cannot rank until the poll has started.',
      );
    }

    return this.pollsRepository.voteNominations(votesData);
  }

  async addResults(pollId: string) {
    const poll = await this.pollsRepository.getPoll(pollId);

    const results = getResults(
      poll.votes,
      poll.nominations,
      poll.votesPerVoter,
    );

    return this.pollsRepository.addResults(pollId, results);
  }

  async cancelPoll(pollID: string): Promise<void> {
    await this.pollsRepository.deletePoll(pollID);
  }
}

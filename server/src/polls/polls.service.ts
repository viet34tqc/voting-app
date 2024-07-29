import { Injectable, Logger } from '@nestjs/common';
import { createPollId, createUserId } from 'src/utils';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { RejoinPollDto } from './dto/rejoin-poll.dto';
import { PollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}
  async create(createPollDto: CreatePollDto) {
    const pollId = createPollId();
    const userId = createUserId();

    const newPoll = await this.pollsRepository.createPoll({
      ...createPollDto,
      pollId,
      userId,
    });

    return {
      poll: newPoll,
    };
  }

  async join(joinPollDto: JoinPollDto) {
    const userId = createUserId();
    this.logger.debug(
      `Fetching poll with ID: ${joinPollDto.pollId} for user with ID: ${userId}`,
    );
    const joinedPoll = await this.pollsRepository.getPoll(joinPollDto.pollId);
    return {
      poll: joinedPoll,
    };
  }

  async rejoin(reJointDto: RejoinPollDto) {
    this.logger.debug(
      `Rejoining poll with ID: ${reJointDto.pollId} for user with Id: ${reJointDto.userId} with name: ${reJointDto.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(reJointDto);

    return joinedPoll;
  }
}

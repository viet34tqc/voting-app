import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createPollId, createUserId } from 'src/utils';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { RejoinPollDto } from './dto/rejoin-poll.dto';
import { PollsRepository } from './polls.repository';

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
}

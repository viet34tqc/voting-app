import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createPollId, createUserId } from 'src/utils';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { RejoinPollDto } from './dto/rejoin-poll.dto';
import { PollRepository } from './poll.repository';

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  constructor(
    private readonly pollRepository: PollRepository,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPollDto: CreatePollDto) {
    const pollId = createPollId();
    const userId = createUserId();

    const createdPoll = await this.pollRepository.createPoll({
      ...createPollDto,
      pollId,
      userId,
    });

    this.logger.debug(
      `Creating token string for pollId: ${createdPoll.id} and userID: ${userId}`,
    );

    const accessToken = this.jwtService.sign(
      {
        pollID: createdPoll.id,
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
    const joinedPoll = await this.pollRepository.getPoll(joinPollDto.pollId);
    const accessToken = this.jwtService.sign(
      {
        pollID: joinedPoll.id,
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

  async rejoin(reJointDto: RejoinPollDto) {
    this.logger.debug(
      `Rejoining poll with ID: ${reJointDto.pollId} for user with Id: ${reJointDto.userId} with name: ${reJointDto.name}`,
    );

    const joinedPoll = await this.pollRepository.addParticipant(reJointDto);

    return joinedPoll;
  }
}

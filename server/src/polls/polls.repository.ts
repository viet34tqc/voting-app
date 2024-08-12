import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e from 'express';
import Redis from 'ioredis';
import { IORedisKey } from 'src/redis/redis.module';
import { Poll } from 'voting-app-shared';
import { AddParticipantData, CreatePollData } from './types';

export class PollsRepository {
  private readonly ttl: string;
  private readonly logger = new Logger(PollsRepository.name);

  constructor(
    configService: ConfigService,
    @Inject(IORedisKey) private readonly redisClient: Redis,
  ) {
    this.ttl = configService.get('POLL_DURATION');
  }

  async createPoll({
    votesPerVoter,
    topic,
    pollId,
    userId,
  }: CreatePollData): Promise<Poll> {
    const initialPoll = {
      id: pollId,
      topic,
      votesPerVoter,
      participants: {},
      adminId: userId,
      hasStarted: false,
    };

    this.logger.log(
      `Creating new poll: ${JSON.stringify(initialPoll, null, 2)} with TTL ${
        this.ttl
      }`,
    );

    const key = `polls:${pollId}`;

    try {
      // We are creating pipeline by using multi()
      // Then we exec this pipeline
      await this.redisClient
        .multi([
          // '.': The path in the JSON object to set. '.' refers to the root path, meaning the entire object is being set.
          ['call', 'JSON.SET', key, '.', JSON.stringify(initialPoll)],
          ['expire', key, this.ttl],
        ])
        .exec();
      return initialPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n${e}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async getPoll(pollId: string): Promise<Poll> {
    this.logger.log(`Attempting to get poll with: ${pollId}`);

    const key = `polls:${pollId}`;

    try {
      const currentPoll = (await this.redisClient.call(
        'JSON.GET',
        key,
        '.',
      )) as string;

      this.logger.verbose(currentPoll);

      // if (currentPoll?.hasStarted) {
      //   throw new BadRequestException('The poll has already started');
      // }

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failed to get pollId ${pollId}`);
      throw e;
    }
  }

  async addParticipant({
    pollId,
    userId,
    name,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userId/name: ${userId}/${name} to pollId: ${pollId}`,
    );

    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(name),
      );

      const updatedPoll = await this.getPoll(pollId);

      this.logger.debug(
        `Current Participants for pollId: ${pollId}:`,
        updatedPoll.participants,
      );
      return updatedPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userId/name: ${userId}/${name} to pollId: ${pollId}`,
      );
      throw e;
    }
  }

  async removeParticipant(pollId: string, userId: string) {
    this.logger.log(`Removing userId: ${userId} from pollId: ${pollId}`);

    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);
      return this.getPoll(pollId);
    } catch (error) {
      this.logger.error(
        `Failed to remove userID: ${userId} from poll: ${pollId}`,
        e,
      );
      throw new InternalServerErrorException('Failed to remove participant');
    }
  }
}

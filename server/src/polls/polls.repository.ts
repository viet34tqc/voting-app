import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e from 'express';
import Redis from 'ioredis';
import { IORedisKey } from 'src/redis/redis.module';
import { Poll, Results } from 'voting-app-shared';
import {
  AddNominationData,
  AddParticipantData,
  CreatePollData,
  voteNominationsData,
} from './types';

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
      nominations: {},
      votes: {},
      results: [],
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
    } catch (error) {
      this.logger.error(
        `Failed to add poll ${JSON.stringify(initialPoll)}\n`,
        error,
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

      return JSON.parse(currentPoll);
    } catch (e) {
      this.logger.error(`Failed to get pollId ${pollId}`, e);
      throw new InternalServerErrorException(`Failed to get pollId ${pollId}`);
    }
  }

  async addParticipant({
    pollId,
    userId,
    userName,
  }: AddParticipantData): Promise<Poll> {
    this.logger.log(
      `Attempting to add a participant with userId/name: ${userId}/${userName} to pollId: ${pollId}`,
    );

    const key = `polls:${pollId}`;
    const participantPath = `.participants.${userId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        participantPath,
        JSON.stringify(userName),
      );

      const updatedPoll = await this.getPoll(pollId);

      this.logger.debug(
        `Current Participants for pollId: ${pollId}:`,
        updatedPoll.participants,
      );
      return updatedPoll;
    } catch (e) {
      this.logger.error(
        `Failed to add a participant with userId/userName: ${userId}/${userName} to pollId: ${pollId}`,
        e,
      );
      throw new InternalServerErrorException(
        `Failed to add a participant with userId/userName: ${userId}/${userName} to pollId: ${pollId}`,
      );
    }
  }

  async addNomination({ pollId, nominationId, nomination }: AddNominationData) {
    this.logger.log(
      `Attempting to add a nomination with nominationId/nomination: ${nominationId}/${nomination.text} to pollId: ${pollId}`,
    );

    const key = `polls:${pollId}`;
    const nominationPath = `.nominations.${nominationId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        nominationPath,
        JSON.stringify(nomination),
      );

      const updatedPoll = await this.getPoll(pollId);

      this.logger.debug(
        `Current Participants for pollId: ${pollId}:`,
        updatedPoll.participants,
      );
      return updatedPoll;
    } catch (error) {
      this.logger.error(
        `Failed to add a nomination with nominationId/text: ${nominationId}/${nomination.text} to pollId: ${pollId}`,
        e,
      );
      throw new InternalServerErrorException(
        `Failed to add a nomination with nominationId/text: ${nominationId}/${nomination.text} to pollId: ${pollId}`,
      );
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

  async removeNomination(pollId: string, nominationId: string) {
    this.logger.log(
      `Removing nomination: ${nominationId} from pollId: ${pollId}`,
    );

    const key = `polls:${pollId}`;
    const participantPath = `.nominations.${nominationId}`;

    try {
      await this.redisClient.call('JSON.DEL', key, participantPath);
      return this.getPoll(pollId);
    } catch (error) {
      this.logger.error(
        `Failed to remove nominationId: ${nominationId} from poll: ${pollId}`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to remove nominationId: ${nominationId} from poll: ${pollId}`,
      );
    }
  }

  async startPoll(pollId: string) {
    this.logger.log(`Starting poll: ${pollId}`);
    const key = `polls:${pollId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        '.hasStarted',
        JSON.stringify(true),
      );

      return this.getPoll(pollId);
    } catch (error) {
      this.logger.error(`Failed to start poll: ${pollId}`, error);
      throw new InternalServerErrorException(`Failed to start poll: ${pollId}`);
    }
  }

  async voteNominations({ pollId, userId, votes }: voteNominationsData) {
    this.logger.log(
      `Attempting add votes for userId: ${userId} to poll: ${pollId}`,
      votes,
    );

    const key = `polls:${pollId}`;
    const votesPath = `.votes.${userId}`;

    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        votesPath,
        JSON.stringify(votes),
      );

      return this.getPoll(pollId);
    } catch (error) {
      this.logger.error(
        `Failed to add a votes for userId/name: ${userId}/ to pollId: ${pollId}`,
        error,
      );
      throw new InternalServerErrorException(
        `Failed to add a votes for userId/name: ${userId}/ to pollId: ${pollId}`,
      );
    }
  }

  async addResults(pollId: string, results: Results) {
    this.logger.log(`Attempting to add results to poll: ${pollId}`);
    const key = `polls:${pollId}`;
    const resultpath = '.results';
    try {
      await this.redisClient.call(
        'JSON.SET',
        key,
        resultpath,
        JSON.stringify(results),
      );
      return this.getPoll(pollId);
    } catch (error) {
      this.logger.error(
        `Failed to add add results for pollId: ${pollId}`,
        results,
        e,
      );
      throw new InternalServerErrorException(
        `Failed to add add results for pollId: ${pollId}`,
      );
    }
  }

  async deletePoll(pollId: string) {
    const key = `polls:${pollId}`;
    this.logger.log(`deleting poll: ${pollId}`);

    try {
      await this.redisClient.call('JSON.DEL', key);
    } catch (error) {
      this.logger.error(`Failed to delete poll: ${pollId}`, e);
      throw new InternalServerErrorException(
        `Failed to delete poll: ${pollId}`,
      );
    }
  }
}

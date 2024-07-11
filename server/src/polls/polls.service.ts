import { Injectable } from '@nestjs/common';
import { createPollId, createUserId } from 'src/utils';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';

@Injectable()
export class PollsService {
  create(createPollDto: CreatePollDto) {
    const pollId = createPollId();
    const userId = createUserId();

    return {
      ...createPollDto,
      pollId,
      userId,
    };
  }

  join(joinPollDto: JoinPollDto) {
    const userId = createUserId();

    return {
      ...joinPollDto,
      userId,
    };
  }
}

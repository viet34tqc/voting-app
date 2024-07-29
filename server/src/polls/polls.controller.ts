import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto.js';
import { JoinPollDto } from './dto/join-poll.dto';
import { PollAuthGuard } from './guards/poll-auth.guard.js';
import { PollsService } from './polls.service';
import { RequestWithAuth } from './types.js';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post('create')
  create(@Body() createPollDto: CreatePollDto) {
    const poll = this.pollsService.create(createPollDto);

    return poll;
  }

  @Post('join')
  join(@Body() joinPollDto: JoinPollDto) {
    return this.pollsService.join(joinPollDto);
  }

  @UseGuards(PollAuthGuard)
  @Post('rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    const { userId, pollId, name } = request;
    const rejoinPollResponse = await this.pollsService.rejoin({
      userId,
      pollId,
      name,
    });

    return {
      poll: rejoinPollResponse,
    };
  }
}

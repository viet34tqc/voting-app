import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto.js';
import { JoinPollDto } from './dto/join-poll.dto.js';
import { PollAuthGuard } from './guards/poll-auth.guard.js';
import { PollService } from './poll.service.js';
import { RequestWithAuth } from './types.js';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post('create')
  create(@Body() createPollDto: CreatePollDto) {
    const poll = this.pollService.create(createPollDto);

    return poll;
  }

  @Post('join')
  join(@Body() joinPollDto: JoinPollDto) {
    return this.pollService.join(joinPollDto);
  }

  @UseGuards(PollAuthGuard)
  @Post('rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    const { userId, pollId, name } = request;
    const rejoinPollResponse = await this.pollService.rejoin({
      userId,
      pollId,
      name,
    });

    return {
      poll: rejoinPollResponse,
    };
  }
}

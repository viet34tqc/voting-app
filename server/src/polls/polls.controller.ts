import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { PollsService } from './polls.service';
import { RequestWithAuth } from './types';

@UsePipes(new ValidationPipe())
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

  @UseGuards(AuthGuard)
  @Post('rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    const { userId, pollId, userName } = request;
    const rejoinPollResponse = await this.pollsService.rejoin({
      userId,
      pollId,
      userName,
    });

    return {
      poll: rejoinPollResponse,
    };
  }
}

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePollDto } from './dto/create-poll.dto';
import { JoinPollDto } from './dto/join-poll.dto';
import { PollsService } from './polls.service';

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
}

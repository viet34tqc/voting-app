import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisDynamicModule } from 'src/modules.config';
import { PollsController } from './polls.controller';
import { PollsRepository } from './polls.repository';
import { PollsService } from './polls.service';

@Module({
  imports: [ConfigModule, RedisDynamicModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}

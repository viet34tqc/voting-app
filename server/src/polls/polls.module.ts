import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtDynamicModule, RedisDynamicModule } from 'src/modules.config';
import { PollsController } from './polls.controller';
import { PollsRepository } from './polls.repository';
import { PollsService } from './polls.service';

@Module({
  imports: [ConfigModule, RedisDynamicModule, JwtDynamicModule],
  controllers: [PollsController],
  providers: [PollsService, PollsRepository],
})
export class PollsModule {}

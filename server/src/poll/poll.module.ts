import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtDynamicModule, RedisDynamicModule } from 'src/modules.config';
import { PollController } from './poll.controller';
import { PollRepository } from './poll.repository';
import { PollService } from './poll.service';
import { PollGateway } from './poll.gateway';

@Module({
  imports: [ConfigModule, RedisDynamicModule, JwtDynamicModule],
  controllers: [PollController],
  providers: [PollService, PollRepository, PollGateway],
})
export class PollModule {}

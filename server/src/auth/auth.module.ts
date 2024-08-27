import { Module } from '@nestjs/common';
import { JwtDynamicModule } from 'src/modules.config';
import { PollsModule } from 'src/polls/polls.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtDynamicModule, PollsModule],
  controllers: [AuthController],
})
export class AuthModule {}

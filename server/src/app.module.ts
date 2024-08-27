import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [ConfigModule.forRoot(), PollsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { JwtDynamicModule } from 'src/modules.config';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtDynamicModule],
  controllers: [AuthController],
})
export class AuthModule {}

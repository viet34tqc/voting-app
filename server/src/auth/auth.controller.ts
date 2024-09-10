import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() request) {
    return {
      userId: request.userId,
      pollId: request.pollId,
      userName: request.userName,
      isAdmin: request.isAdmin,
    };
  }
}

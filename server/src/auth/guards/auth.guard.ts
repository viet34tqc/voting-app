import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PollsService } from 'src/polls/polls.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly pollsService: PollsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ForbiddenException('No access token provided');
    }
    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.sub;
      request.pollId = payload.pollId;
      request.userName = payload.userName;
    } catch {
      throw new ForbiddenException('Invalid access token');
    }

    const poll = await this.pollsService.getPoll(request.pollId);

    if (!poll) {
      throw new ForbiddenException('There is no poll');
    }

    if (poll.adminId === request.userId) {
      request.isAdmin = true;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

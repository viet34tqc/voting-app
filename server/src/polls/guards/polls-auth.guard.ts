import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
//Check the JWT validity, decode JWT payload and attach to the request body
export class PollsAuthGuard implements CanActivate {
  private readonly logger = new Logger(PollsAuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(
      'Checking the auth token in the request body',
      request.body,
    );

    const { accessToken } = request.body;

    if (!accessToken) {
      throw new ForbiddenException('No access token provided');
    }

    this.logger.debug(`Validating access token': ${accessToken}`);

    try {
      const payload = this.jwtService.verify(accessToken);
      request.userId = payload.sub;
      request.pollId = payload.pollId;
      request.name = payload.name;
      return true;
    } catch {
      throw new ForbiddenException('Invalid access token');
    }
  }
}

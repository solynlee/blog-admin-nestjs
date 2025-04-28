import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './pubic.decorator';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './auth.jwt.secret';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('用户未登录');
    }
    return true;
  }
}
function extractTokenFromHeader(request) {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: unknown }>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente.');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      request.user = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}

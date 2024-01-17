import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}

    verifyToken(token: string) {
        try {
            return this.jwtService.verifyAsync(token);
        } catch {
            throw new UnauthorizedException();
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const payload = await this.verifyToken(token);
        const user = await this.usersService.findById(payload.sub);

        if (
            !user ||
            (user.lastLogout !== null && user.lastLogout < new Date())
        ) {
            throw new UnauthorizedException();
        }

        request['user'] = { id: user.id, username: user.username };

        return true;
    }

    // TODO: handle leading and trailing whitespaces
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        // TODO: figure out if this should run if user is undefined?
        const match = await bcrypt.compare(password, user?.password ?? '');
        console.log('match: ', match);

        if (!user || !match) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id };
        const jwt = await this.jwtService.signAsync(payload);

        return { jwt };
    }
}

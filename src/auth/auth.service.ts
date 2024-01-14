import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        // note: to prevent time-based attacks,
        // we should use bcrypt.compare even if the user does not exist
        const userPassword =
            user?.password ?? this.configService.get('FAKE_BCRYPT_HASH')!;
        const match = await bcrypt.compare(password, userPassword);

        if (!user || !match) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id };
        const jwt = await this.jwtService.signAsync(payload);

        return { jwt };
    }
}

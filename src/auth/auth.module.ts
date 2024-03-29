import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}

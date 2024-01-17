import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import { IsNotEmpty, IsString } from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

class SignInDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(200)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.login(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Post('logout')
    logout(@Request() request: ExpressRequest) {
        return this.authService.logout(request.user!.id);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    me(@Request() request: ExpressRequest) {
        return request.user;
    }
}

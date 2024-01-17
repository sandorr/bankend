import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';

import {
    IsIBAN,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { Account } from '../accounts/account.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Transfer } from './transfer.entity';
import { TransfersService } from './transfers.service';

class GetOwnQueryDto {
    @IsOptional()
    @IsUUID()
    fromAccount?: Account['id'];

    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;
}

export class CreateDto {
    @IsUUID()
    fromAccount: Account['id'];

    @IsString()
    @IsNotEmpty()
    toName: Transfer['toName'];

    // TODO: validate BIC
    @IsString()
    @IsNotEmpty()
    toBic: Transfer['toBic'];

    @IsIBAN()
    toIban: Transfer['toIban'];

    @IsNumber()
    @Min(0.01)
    amount: Transfer['amount'];

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    reference?: Transfer['reference'];
}

@UseGuards(AuthGuard)
@Controller('transfers')
export class TransfersController {
    constructor(private transfersService: TransfersService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    getOwn(@Request() request: ExpressRequest, @Query() query: GetOwnQueryDto) {
        const page = query.page ?? 1;

        return this.transfersService.findOwn(
            request.user!.id,
            query.fromAccount,
            page,
        );
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Request() request: ExpressRequest, @Body() createDto: CreateDto) {
        return this.transfersService.create(request.user!.id, createDto);
    }
}

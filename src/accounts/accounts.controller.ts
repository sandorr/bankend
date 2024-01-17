import {
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    ParseIntPipe,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';

import { Transform } from 'class-transformer';
import {
    IsDecimal,
    IsIBAN,
    IsInt,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { AuthGuard } from '../auth/auth.guard';
import { GetOwnByBalanceResponse, PaginatedResponse } from '../types';
import { Account } from './account.entity';
import { AccountsService } from './accounts.service';

class GetByIbanParams {
    @IsIBAN()
    iban: string;
}

// TODO: use decimals for balances
class GetOwnByBalanceQuery {
    @IsOptional()
    @IsNumber()
    @Min(0)
    minBalance?: number;

    @IsOptional()
    @IsNumber()
    maxBalance?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;
}

@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @HttpCode(200)
    @Get()
    async getOwnByBalance(
        @Request() request: ExpressRequest,
        @Query() query: GetOwnByBalanceQuery,
    ): Promise<GetOwnByBalanceResponse> {
        const page = query.page ?? 1;

        return this.accountsService.findOwnByBalance(
            request.user!.id,
            query.minBalance,
            query.maxBalance,
            page,
        );
    }

    @HttpCode(200)
    @Get('/:iban')
    async getByIban(
        @Request() request: ExpressRequest,
        @Param() params: GetByIbanParams,
    ): Promise<Account> {
        const account = await this.accountsService.findByIban(
            request.user!.id,
            params.iban,
        );

        if (!account) {
            throw new NotFoundException();
        }

        return account;
    }
}

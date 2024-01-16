import {
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Query,
    Request,
} from '@nestjs/common';

import { IsDecimal, IsIBAN, IsInt, Min } from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { Account } from './account.entity';
import { AccountsService } from './accounts.service';

class GetByIbanParams {
    @IsIBAN()
    iban: string;
}

class GetOwnByBalanceQuery {
    @IsDecimal({ decimal_digits: '0,2' })
    @Min(0)
    minBalance?: number;

    @IsDecimal({ decimal_digits: '0,2' })
    maxBalance?: number;

    @IsInt()
    @Min(1)
    page?: number;
}

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

    @HttpCode(200)
    @Get()
    async getOwnByBalance(
        @Request() request: ExpressRequest,
        @Query() query: GetOwnByBalanceQuery,
    ): Promise<Account[]> {
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

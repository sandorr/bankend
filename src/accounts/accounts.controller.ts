import {
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Request,
} from '@nestjs/common';

import { IsIBAN } from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { Account } from './account.entity';
import { AccountsService } from './accounts.service';

class GetByIbanParams {
    @IsIBAN()
    iban: string;
}

@Controller('accounts')
export class AccountsController {
    constructor(private accountsService: AccountsService) {}

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

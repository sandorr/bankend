import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';

import {
    IsDecimal,
    IsIBAN,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
} from 'class-validator';
import { Request as ExpressRequest } from 'express';

import { Account } from '../accounts/account.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Transfer } from './transfer.entity';
import { TransfersService } from './transfers.service';

export class TransferCreationDto {
    @IsInt()
    @Min(1)
    fromAccount: Account['id'];

    @IsString()
    @IsNotEmpty()
    toName: Transfer['toName'];

    @IsString()
    @IsNotEmpty()
    toBic: Transfer['toBic'];

    @IsIBAN()
    toIban: Transfer['toIban'];

    @IsDecimal({ decimal_digits: '2' })
    @Min(0.01)
    amount: Transfer['amount'];

    @IsString()
    reference: Transfer['reference'];
}

@Controller('transfers')
@UseGuards(AuthGuard)
export class TransfersController {
    constructor(private transfersService: TransfersService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    getAll(@Request() request: ExpressRequest) {
        return this.transfersService.findOwn(request.user!.id);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(
        @Request() request: ExpressRequest,
        @Body() transferCreationDto: TransferCreationDto,
    ) {
        return this.transfersService.create(
            request.user!.id,
            transferCreationDto,
        );
    }
}

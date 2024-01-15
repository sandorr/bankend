import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '../accounts/account.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { Transfer } from './transfer.entity';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
    imports: [TypeOrmModule.forFeature([Transfer, Account]), AccountsModule],
    controllers: [TransfersController],
    providers: [TransfersService],
})
export class TransfersModule {}

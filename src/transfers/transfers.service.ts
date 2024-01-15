import {
    ForbiddenException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity';
import { Transfer } from './transfer.entity';
import { TransferCreationDto } from './transfers.controller';

@Injectable()
export class TransfersService {
    constructor(
        @InjectRepository(Transfer)
        private transfersRepository: Repository<Transfer>,
        private dataSource: DataSource,
    ) {}

    findOwn(userId: User['id']): Promise<Transfer[]> {
        return this.transfersRepository.findBy({
            fromAccount: {
                user: {
                    id: userId,
                },
            },
        });
    }

    async create(
        userId: User['id'],
        transferCreationDto: TransferCreationDto,
    ): Promise<Transfer> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const account = await queryRunner.manager.findOne(Account, {
                where: {
                    id: transferCreationDto.fromAccount,
                    user: {
                        id: userId,
                    },
                },
            });

            if (!account) {
                throw new ForbiddenException();
            }

            // TODO: use some number string type instead
            if (account.balance < transferCreationDto.amount) {
                throw new UnprocessableEntityException();
            }

            account.balance -= transferCreationDto.amount;

            await queryRunner.manager.save(account);

            const transfer = new Transfer();
            transfer.fromAccount = account;
            transfer.toName = transferCreationDto.toName;
            transfer.toBic = transferCreationDto.toBic;
            transfer.toIban = transferCreationDto.toIban;
            transfer.amount = transferCreationDto.amount;
            transfer.reference = transferCreationDto.reference;

            await queryRunner.manager.save(transfer);
            return transfer;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

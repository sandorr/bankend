import {
    ForbiddenException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';

import { Account } from '../accounts/account.entity';
import { GetOwnTransfersResponse } from '../types';
import { User } from '../users/user.entity';
import { Transfer } from './transfer.entity';
import { CreateDto } from './transfers.controller';

@Injectable()
export class TransfersService {
    constructor(
        @InjectRepository(Transfer)
        private transfersRepository: Repository<Transfer>,
        private dataSource: DataSource,
    ) {}

    async findOwn(
        userId: User['id'],
        fromAccount: Account['id'] | undefined,
        page: number,
    ): Promise<GetOwnTransfersResponse> {
        const pageSize = 10;
        const queryBuilder = this.transfersRepository
            .createQueryBuilder('transfer')
            .innerJoinAndSelect('transfer.fromAccount', 'fromAccount')
            .innerJoin('fromAccount.user', 'fromAccountUser')
            .where('fromAccountUser.id = :userId', { userId });

        if (fromAccount !== undefined) {
            queryBuilder.andWhere('fromAccount.id = :fromAccount', {
                fromAccount,
            });
        }

        const transfers = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        const total = await queryBuilder.getCount();

        return { data: transfers, meta: { page: 1, pageSize, total } };
    }

    async create(userId: User['id'], createDto: CreateDto): Promise<Transfer> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const account = await queryRunner.manager.findOne(Account, {
                where: {
                    id: createDto.fromAccount,
                    user: {
                        id: userId,
                    },
                },
            });

            if (!account) {
                throw new ForbiddenException();
            }

            // TODO: use decimals
            if (+account.balance < createDto.amount) {
                throw new UnprocessableEntityException();
            }

            account.balance -= createDto.amount;

            await queryRunner.manager.save(account);

            const transfer = new Transfer();
            transfer.fromAccount = account;
            transfer.toName = createDto.toName;
            transfer.toBic = createDto.toBic;
            transfer.toIban = createDto.toIban;
            transfer.amount = createDto.amount;
            transfer.reference = createDto.reference ?? null;

            await queryRunner.manager.save(transfer);
            await queryRunner.commitTransaction();
            return transfer;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}

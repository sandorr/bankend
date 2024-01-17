import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { GetOwnByBalanceResponse } from '../types';
import { User } from '../users/user.entity';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
    ) {}

    async findOwnByBalance(
        userId: User['id'],
        minBalance: Account['balance'] | undefined,
        maxBalance: Account['balance'] | undefined,
        page: number,
    ): Promise<GetOwnByBalanceResponse> {
        const pageSize = 10;
        const queryBuilder = this.accountsRepository
            .createQueryBuilder('account')
            .where('account.user = :userId', { userId });

        if (minBalance !== undefined) {
            queryBuilder.andWhere('account.balance >= :minBalance', {
                minBalance,
            });
        }

        if (maxBalance !== undefined) {
            queryBuilder.andWhere('account.balance <= :maxBalance', {
                maxBalance,
            });
        }

        const { totalBalance } = await queryBuilder
            .clone()
            .select('SUM(account.balance)', 'totalBalance')
            .getRawOne();
        const accounts = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        const total = await queryBuilder.getCount();

        return {
            data: { accounts, totalBalance },
            meta: {
                total,
                page,
                pageSize,
            },
        };
    }

    findByIban(
        userId: User['id'],
        iban: Account['iban'],
    ): Promise<Account | null> {
        return this.accountsRepository.findOneBy({
            iban,
            user: { id: userId },
        });
    }
}

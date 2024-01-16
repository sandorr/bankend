import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../users/user.entity';
import { Account } from './account.entity';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountsRepository: Repository<Account>,
    ) {}

    findOwnByBalance(
        userId: User['id'],
        minBalance: number | undefined,
        maxBalance: number | undefined,
        page: number,
    ): Promise<Account[]> {
        const pageSize = 10;
        const queryBuilder = this.accountsRepository
            .createQueryBuilder('account')
            .where('account.user = :userId', { userId });

        if (minBalance !== undefined && maxBalance !== undefined) {
            queryBuilder.andWhere(
                'account.balance BETWEEN :minBalance AND :maxBalance',
                { minBalance, maxBalance },
            );
        } else if (minBalance !== undefined) {
            queryBuilder.andWhere('account.balance >= :minBalance', {
                minBalance,
            });
        } else if (maxBalance !== undefined) {
            queryBuilder.andWhere('account.balance <= :maxBalance', {
                maxBalance,
            });
        }

        // TODO: aggregation for total balance

        return queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
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

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

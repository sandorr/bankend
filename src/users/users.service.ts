import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findByUsername(username: User['username']): Promise<User | null> {
        return this.usersRepository.findOneBy({
            username,
        });
    }

    async findById(id: User['id']): Promise<User | null> {
        return this.usersRepository.findOneBy({
            id,
        });
    }

    async updateLastLogout(
        userId: User['id'],
        lastLogout: Date | null,
    ): Promise<void> {
        await this.usersRepository.update({ id: userId }, { lastLogout });
    }
}

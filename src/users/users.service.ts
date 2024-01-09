import { Injectable } from '@nestjs/common';

export type User = {
    id: number;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            id: 1,
            username: 'admin',
            password:
                '$2b$10$DYzlDHIlVTPV5EIwvGBqnezbsGxsoqV3nSr8T.C.rPtdVsOCq8Grm',
        },
    ];

    async findOne(username: string): Promise<User | undefined> {
        return this.users.find((user) => user.username === username);
    }
}

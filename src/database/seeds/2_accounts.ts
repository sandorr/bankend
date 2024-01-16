import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { Account } from '../../accounts/account.entity';
import { User } from '../../users/user.entity';

const accounts = require('./data/accounts.json');

export default class CreateAccounts implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        const queryBuilder = connection.createQueryBuilder();
        const adminUser = await queryBuilder
            .select('user')
            .from(User, 'user')
            .where('user.username = :username', { username: 'admin' })
            .getOneOrFail();

        await queryBuilder
            .insert()
            .into(Account)
            .values(
                accounts.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    countryCode: item.country,
                    balance: item.balances.available.value,
                    currencyCode: item.balances.available.currency,
                    iban: item.IBAN,
                    createdAt: item.createdAt,
                    updatedAt: item.createdAt,
                    user: adminUser,
                })),
            )
            .execute();
    }
}

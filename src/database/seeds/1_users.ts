import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

import { User } from '../../users/user.entity';

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {
        await connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {
                    username: 'admin',
                    password:
                        '$2y$10$EvQ9P7de23iWJW.JrI07DOmg4l9wWKkvmf6u8Mi8zSuf.DdmvPQ8K',
                },
            ])
            .execute();
    }
}

import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

enum CountryCode {
    DEU,
    HUN,
}

enum CurrencyCode {
    EUR,
}

@Entity()
@Unique(['user', 'name'])
export class Account {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: CountryCode })
    countryCode: CountryCode;

    @Column({ type: 'decimal', default: 0 })
    balance: number;

    @Column({ type: 'enum', enum: CurrencyCode })
    currencyCode: CurrencyCode;

    @Column({ unique: true })
    iban: string;

    @ManyToOne(() => User, (user) => user.accounts)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

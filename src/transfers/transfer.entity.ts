import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Account } from '../accounts/account.entity';

@Entity()
export class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Account, (account) => account.user)
    fromAccount: Account;

    @Column()
    toName: string;

    @Column()
    toBic: string;

    @Column()
    toIban: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ nullable: true })
    reference: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

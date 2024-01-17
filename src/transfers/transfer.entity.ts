import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Account } from '../accounts/account.entity';

@Entity()
export class Transfer {
    @PrimaryGeneratedColumn()
    id: number;

    @JoinColumn()
    @OneToOne(() => Account)
    fromAccount: Account;

    @Column()
    toName: string;

    @Column()
    toBic: string;

    @Column()
    toIban: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ type: String, nullable: true })
    reference: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

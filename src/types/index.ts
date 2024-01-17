import { Account } from '../accounts/account.entity';
import { Transfer } from '../transfers/transfer.entity';

export type PaginatedResponse<T> = {
    data: T;
    meta: {
        total: number;
        page: number;
        pageSize: number;
    };
};

export type GetOwnAccountsByBalanceResponse = PaginatedResponse<{
    accounts: Account[];
    totalBalance: number;
}>;

export type GetOwnTransfersResponse = PaginatedResponse<Transfer[]>;

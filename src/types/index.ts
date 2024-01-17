import { Account } from '../accounts/account.entity';

export type PaginatedResponse<T> = {
    data: T;
    meta: {
        total: number;
        page: number;
        pageSize: number;
    };
};

export type GetOwnByBalanceResponse = PaginatedResponse<{
    accounts: Account[];
    totalBalance: number;
}>;

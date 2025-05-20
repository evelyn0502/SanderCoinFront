import type { Transaction } from './Transaction';

export interface Block {
    index: number;
    previousHash: string;
    hash: string;
    transactions: Transaction[];
    date: string; // DateOnly del backend
    time: string; // TimeOnly del backend
}

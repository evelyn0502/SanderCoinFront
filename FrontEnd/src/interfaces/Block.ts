import type { Transaction } from './Transaction';

export interface Block {
    index: number;
    previousHash: string;
    hash: string;
    transactions: Transaction[];
    date: string; 
    time: string; 
}

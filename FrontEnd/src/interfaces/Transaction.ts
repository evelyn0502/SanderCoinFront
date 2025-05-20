export interface Transaction {
    senderId: string;
    receiverId: string;
    amount: number;
    email?: string;
}

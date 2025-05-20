export interface User {
    id: string;
    balance: number;
    email: string;
    isVerified: boolean;
    verificationCode?: string;
}

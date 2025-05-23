export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  isVerified: boolean;
  verificationCode?: string;
}

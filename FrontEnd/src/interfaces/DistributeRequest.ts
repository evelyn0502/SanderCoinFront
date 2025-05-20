
export interface PaymentFormData {
  userId: string;
  amount: number;
  creditCardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  amount?: number;
}
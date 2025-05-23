export interface PaymentFormData {
  userId: string;
  amount: number;
  creditCardNumber: string;
  expirationDate: string;
  cvv: string;
}

export interface TokenValue {
  value: number;
  timestamp: string;
}

import httpClient from './httpClient';
import type { PaymentFormData } from '../interfaces/Payment';
import type { Transaction } from '../interfaces/Transaction';
import type { SellRequest } from '../interfaces/SellRequest';

export const getTokenValue = () => httpClient.get('/Token/value');
export const distributeTokens = (data: PaymentFormData) =>
  httpClient.post('/Token/distribute', data);
export const transferTokens = (data: Transaction) =>
  httpClient.post('/Token/transfer', data);
export const getTokenBalance = (userId: string) =>
  httpClient.get(`/Token/balance/${userId}`);
export const getTokenSummary = () => httpClient.get('/Token/summary');
export const sellTokens = (data: SellRequest) =>
  httpClient.post('/Token/sell', data);
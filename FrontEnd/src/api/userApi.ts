import httpClient from './httpClient';

export const loginUser = (data: { email: string; password: string }) =>
  httpClient.post('/User/login', data);

export const registerUser = (data: { userId: string; email: string }) =>
  httpClient.post('/User/register', data);

export const verifyUser = (data: { userId: string; code: string }) =>
  httpClient.post('/User/verify', data);


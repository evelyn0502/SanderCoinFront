import httpClient from './httpClient';


export const getLatestBlock = () => httpClient.get('/Blockchain/latest-block');
export const getBlockchain = () => httpClient.get('/Blockchain/blockchain');
export const validateBlockchain = () => httpClient.get('/Blockchain/validate-blockchain');
export const getUserTransactions = (userId: string) => httpClient.get(`/Blockchain/transactions/${userId}`);
export const getBlockchainStatistics = () => httpClient.get('/Blockchain/statistics');

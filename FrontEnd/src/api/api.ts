import axios from 'axios';

const API_URL = 'http://localhost:5179/api';

// ------------------ Blockchain ------------------

export const getLatestBlock = () => {
    return axios.get(`${API_URL}/Blockchain/latest-block`);
};

export const getBlockchain = () => {
    return axios.get(`${API_URL}/Blockchain/blockchain`);
};

export const validateBlockchain = () => {
    return axios.get(`${API_URL}/Blockchain/validate-blockchain`);
};

export const getUserTransactions = (userId: string) => {
    return axios.get(`${API_URL}/Blockchain/transactions/${userId}`);
};

export const getBlockchainStatistics = () => {
    return axios.get(`${API_URL}/Blockchain/statistics`);
};

// ------------------ Token ------------------

export const getTokenValue = () => {
    return axios.get(`${API_URL}/Token/value`);
};

export const distributeTokens = (data: any) => {
    return axios.post(`${API_URL}/Token/distribute`, data);
};

export const transferTokens = (data: any) => {
    return axios.post(`${API_URL}/Token/transfer`, data);
};

export const getTokenBalance = (userId: string) => {
    return axios.get(`${API_URL}/Token/balance/${userId}`);
};

export const getTokenSummary = () => {
    return axios.get(`${API_URL}/Token/summary`);
};

export const sellTokens = (data: any) => {
    return axios.post(`${API_URL}/Token/sell`, data);
};

// ------------------ User ------------------

export const loginUser = (data: any) => {
    return axios.post(`${API_URL}/User/login`, data);
};

export const registerUser = (data: any) => {
    return axios.post(`${API_URL}/User/register`, data);
};

export const verifyUser = (data: any) => {
    return axios.post(`${API_URL}/User/verify`, data);
};

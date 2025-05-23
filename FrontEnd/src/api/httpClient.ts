import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:5179/api',
});

export default httpClient;



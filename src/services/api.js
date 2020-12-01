import axios from 'axios';

const api = axios.create({
  baseURL: 'https://coop-api-v1.herokuapp.com/api',
});

export default api;

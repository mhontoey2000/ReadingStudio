
import axios from 'axios';
export const API_BASE_URL = 'http://localhost:5004/';
export const apiClient = axios.create({baseURL:API_BASE_URL});
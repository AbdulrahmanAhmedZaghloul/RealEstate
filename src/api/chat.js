// api/chat.js
import axios from 'axios';
import { useAuth } from '../context/authContext';

const API_BASE_URL = 'https://sienna-woodpecker-844567.hostingersite.com/api/v1/chat';
const token = sessionStorage.getItem('token') || localStorage.getItem('token'); // أو من context/auth
// const { user } = useAuth();
export const chatApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
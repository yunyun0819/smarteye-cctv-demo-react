import axios from 'axios';

// npm run dev   => .env.development 파일을 읽음
// npm run build => .env.production  파일을 읽음
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
})

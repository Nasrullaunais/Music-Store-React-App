// API Configuration for Music Store Frontend
import axios from 'axios';

// Get the API base URL from environment variable or fallback to localhost:8082
export const API_BASE_URL ='http://localhost:8082';

// Create axios instance with default configuration
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API Endpoints according to API_Documentation.md
export const API_ENDPOINTS = {
    // Authentication Endpoints
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        ME: '/api/auth/me',
        VALIDATE_TOKEN: '/api/auth/validate-token',
    },

    // Music Endpoints
    MUSIC: {
        GET_ALL: '/api/music',
        GET_BY_ID: (id: number) => `/api/music/${id}`,
        UPLOAD: '/api/music/upload',
        GENRES: '/api/music/genres',
        ARTISTS: '/api/music/artists',
        FEATURED: '/api/music/featured',
        SEARCH: '/api/music/search',
        PURCHASED: '/api/customer/purchased',
    },

    // Cart Endpoints
    CART: {
        GET: '/api/cart',
        ADD: (musicId: number) => `/api/cart/add/${musicId}`,
        REMOVE: (itemId: number) => `/api/cart/remove/${itemId}`,
        CLEAR: '/api/cart/clear',
        CHECKOUT: '/api/cart/checkout',
    },

    // Review Endpoints
    REVIEWS: {
        GET_BY_MUSIC: (musicId: number) => `/api/reviews/music/${musicId}`,
        CREATE: '/api/reviews',
        UPDATE: (reviewId: number) => `/api/reviews/${reviewId}`,
        DELETE: (reviewId: number) => `/api/reviews/${reviewId}`,
        STATS: (musicId: number) => `/api/reviews/music/${musicId}/stats`,
    },

    // Staff Endpoints
    STAFF: {
        TICKETS: '/api/staff/tickets',
        TICKET_BY_ID: (ticketId: number) => `/api/staff/tickets/${ticketId}`,
        TICKET_REPLY: (ticketId: number) => `/api/staff/tickets/${ticketId}/reply`,
        TICKET_STATUS: (ticketId: number) => `/api/staff/tickets/${ticketId}/status`,
        ANALYTICS: '/api/staff/analytics/website',
        REPORTS_SALES: '/api/staff/reports/sales',
    },

    // Admin Endpoints (if needed)
    ADMIN: {
        USERS: '/api/admin/users',
        MUSIC_APPROVAL: '/api/admin/music/approve',
    },
} as const;



// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); // <- This closing parenthesis and semicolon should be here
export default apiClient;

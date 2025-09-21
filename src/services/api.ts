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
    },

    // Ticket/Support Endpoints
    TICKETS: {
        CREATE: '/api/customer/support/ticket',
        GET_CUSTOMER_TICKETS: '/api/customer/support/tickets',
        ADD_MESSAGE: (ticketId: number) => `/api/customer/support/ticket/${ticketId}/message`,
        GET_MESSAGES: (ticketId: number) => `/api/customer/support/ticket/${ticketId}/messages`,
        GET_BY_ID: (ticketId: number) => `/api/customer/support/ticket/${ticketId}`,
    },

    // Staff Endpoints
    STAFF: {
        TICKETS: '/api/staff/tickets',
        TICKET_BY_ID: (ticketId: number) => `/api/staff/tickets/${ticketId}`,
        TICKET_MESSAGES: (ticketId: number) => `/api/staff/tickets/${ticketId}/messages`,
        TICKET_REPLY: (ticketId: number) => `/api/staff/tickets/${ticketId}/reply`,
        TICKET_ASSIGN: (ticketId: number) => `/api/staff/tickets/${ticketId}/assign`,
        TICKET_STATUS: (ticketId: number) => `/api/staff/tickets/${ticketId}/status`,
        TICKET_CLOSE: (ticketId: number) => `/api/staff/tickets/${ticketId}/close`,
        TICKETS_URGENT: '/api/staff/tickets/urgent',
        TICKETS_NEEDS_ATTENTION: '/api/staff/tickets/needs-attention',
        TICKETS_UNASSIGNED: '/api/staff/tickets/unassigned',
        TICKETS_SEARCH: '/api/staff/tickets/search',
        TICKETS_STATS: '/api/staff/tickets/stats',
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

// Ticket API Service for Music Store
import { apiClient } from '../services/api';
import { Ticket, CreateTicketRequest, AddMessageRequest, TicketMessage } from '../types';

// Get JWT token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Set authorization header
const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Customer Ticket Operations
export const ticketAPI = {
    // Create a new support ticket
    createTicket: async (ticketData: CreateTicketRequest): Promise<Ticket> => {
        const response = await apiClient.post(
            '/api/customer/support/ticket',
            ticketData,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get all tickets for the authenticated customer
    getCustomerTickets: async (): Promise<Ticket[]> => {
        const response = await apiClient.get(
            '/api/customer/support/tickets',
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Add a message to an existing ticket
    addMessageToTicket: async (ticketId: number, messageData: AddMessageRequest): Promise<TicketMessage> => {
        const response = await apiClient.post(
            `/api/customer/support/ticket/${ticketId}/message`,
            messageData,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get all messages for a specific ticket
    getTicketMessages: async (ticketId: number): Promise<TicketMessage[]> => {
        const response = await apiClient.get(
            `/api/customer/support/ticket/${ticketId}/messages`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get a specific ticket by ID
    getTicketById: async (ticketId: number): Promise<Ticket> => {
        const response = await apiClient.get(
            `/api/customer/support/ticket/${ticketId}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
};

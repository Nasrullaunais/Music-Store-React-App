// Ticket API Service for Music Store
import { apiClient } from '../services/api';
import { Ticket, CreateTicketRequest, AddMessageRequest, TicketMessage } from '@/types';

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

// Staff Ticket Operations
export const staffTicketAPI = {
    // Get all tickets (staff view)
    getAllTickets: async (status?: string): Promise<Ticket[]> => {
        const url = status
            ? `/api/staff/tickets?status=${status}`
            : '/api/staff/tickets';
        const response = await apiClient.get(url, { headers: getAuthHeaders() });
        return response.data;
    },

    // Get urgent tickets
    getUrgentTickets: async (): Promise<Ticket[]> => {
        const response = await apiClient.get(
            '/api/staff/tickets/urgent',
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get tickets needing attention
    getTicketsNeedingAttention: async (): Promise<Ticket[]> => {
        const response = await apiClient.get(
            '/api/staff/tickets/needs-attention',
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get unassigned tickets
    getUnassignedTickets: async (): Promise<Ticket[]> => {
        const response = await apiClient.get(
            '/api/staff/tickets/unassigned',
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Reply to a ticket
    replyToTicket: async (ticketId: number, message: string): Promise<TicketMessage> => {
        const response = await apiClient.post(
            `/api/staff/tickets/${ticketId}/reply`,
            { message }, // Backend expects 'message' field as per TicketReplyRequest DTO
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Assign ticket to authenticated staff member
    assignTicket: async (ticketId: number): Promise<void> => {
        await apiClient.post(
            `/api/staff/tickets/${ticketId}/assign`,
            {}, // Empty body as backend expects
            { headers: getAuthHeaders() }
        );
    },

    // Update ticket status
    updateTicketStatus: async (ticketId: number, status: string): Promise<void> => {
        await apiClient.put(
            `/api/staff/tickets/${ticketId}/status`,
            { status },
            { headers: getAuthHeaders() }
        );
    },

    // Close ticket
    closeTicket: async (ticketId: number): Promise<void> => {
        await apiClient.post(
            `/api/staff/tickets/${ticketId}/close`,
            {},
            { headers: getAuthHeaders() }
        );
    },

    // Search tickets
    searchTickets: async (query: string): Promise<Ticket[]> => {
        const response = await apiClient.get(
            `/api/staff/tickets/search?query=${encodeURIComponent(query)}`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    },

    // Get ticket messages (staff view)
    getTicketMessages: async (ticketId: number): Promise<TicketMessage[]> => {
        const response = await apiClient.get(
            `/api/staff/tickets/${ticketId}/messages`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
};

// Refund API functions for Music Store Frontend
import { apiClient } from '@/services/api';
import { RefundRequest, RefundEligibility, PaginatedOrders } from '@/types';

// Customer Refund API
export const refundApi = {
  // Apply for a refund
  applyForRefund: async (orderId: number, reason: string): Promise<RefundRequest> => {
    const response = await apiClient.post(`/api/customer/orders/${orderId}/refund`, { reason });
    return response.data;
  },

  // Check if order is eligible for refund
  checkRefundEligibility: async (orderId: number): Promise<RefundEligibility> => {
    const response = await apiClient.get(`/api/customer/orders/${orderId}/refund/eligible`);
    return response.data;
  },

  // Get all customer's refund requests
  getMyRefunds: async (): Promise<RefundRequest[]> => {
    const response = await apiClient.get('/api/customer/refunds');
    return response.data;
  },

  // Get specific refund request details
  getRefundById: async (refundId: number): Promise<RefundRequest> => {
    const response = await apiClient.get(`/api/customer/refunds/${refundId}`);
    return response.data;
  },

  // Get customer's orders with pagination
  getMyOrders: async (page: number = 0, size: number = 10): Promise<PaginatedOrders> => {
    const response = await apiClient.get('/api/customer/orders', {
      params: { page, size }
    });
    return response.data;
  },
};

export default refundApi;

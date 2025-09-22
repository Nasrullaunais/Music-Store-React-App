import { apiClient } from '@/services/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  artistName?: string;
  cover?: string;
  enabled: boolean;
  createdAt?: string; // Optional since it could be null
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  role: 'CUSTOMER' | 'ARTIST' | 'STAFF' | 'ADMIN';
  firstName?: string;
  lastName?: string;
}

export interface SystemOverview {
  totalUsers: number;
  totalMusic: number;
  totalOrders: number;
  totalRevenue: number;
  flaggedMusic: number;
  activeTickets: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface FlaggedMusic {
  id: number;
  name: string;
  artistUsername: string;
  flaggedAt: string;
  flaggedByCustomerId: number;
  price: number;
  genre: string;
}

export interface AdminReview {
  id: number;
  content: string;
  rating: number;
  customerUsername: string;
  musicName: string;
  artistUsername: string;
  createdAt: string;
}

export interface AdminOrder {
  id: number;
  customerUsername: string;
  totalAmount: number;
  orderDate: string;
  status: string;
  items: {
    musicName: string;
    artistUsername: string;
    price: number;
  }[];
}

export interface AdminTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  customerUsername: string;
  assignedStaffUsername?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PerformanceMetrics {
  memoryUsed: number;
  memoryTotal: number;
  memoryFree: number;
  processors: number;
  databaseConnections: string;
  activeUsers: number;
  systemUptime: string;
}

export interface DetailedAnalytics {
  userGrowth: {
    newUsers: number;
    growthRate: number;
    activeUsers: number;
  };
  usersByRole: any;
  salesAnalytics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  }; // Backend returns an object, not an array
  revenueByPeriod: any;
  topSellingMusic: any[];
  musicByGenre: {
    [key: string]: number; // e.g., { "Rock": 10, "Pop": 15, "Jazz": 5 }
  }; // Backend returns an object, not an array
  musicByCategory: any;
  artistPerformance: {
    topArtist: string;
    totalTracks: number;
    totalRevenue: number;
  }; // Backend returns an object, not an array
  reviewAnalytics: any;
  ratingDistribution: any;
  ticketAnalytics: any;
  ticketResolutionTime: any;
}

export const adminAPI = {
  // User Management
  async getAllUsers(page = 0, size = 10, role?: string): Promise<{ content: AdminUser[]; totalElements: number }> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (role) params.append('role', role);

    const response = await apiClient.get(`/api/admin/users?${params}`);
    return response.data;
  },

  async createUser(userData: CreateUserRequest): Promise<AdminUser> {
    const response = await apiClient.post('/api/admin/users/create', userData);
    return response.data;
  },

  async updateUser(userId: number, userData: Partial<CreateUserRequest>): Promise<AdminUser> {
    const response = await apiClient.put(`/api/admin/users/${userId}`, userData);
    return response.data;
  },

  async toggleUserStatus(userId: number, enabled: boolean): Promise<void> {
    // Use the correct backend endpoint structure
    await apiClient.put(`/api/admin/users/${userId}/status`, {
      enabled: enabled
    });
  },

  // Analytics
  async getSystemOverview(): Promise<SystemOverview> {
    const response = await apiClient.get('/api/admin/analytics/overview');
    return response.data;
  },

  async getDetailedAnalytics(startDate?: string, endDate?: string): Promise<DetailedAnalytics> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.get(`/api/admin/analytics/detailed?${params}`);
    return response.data;
  },

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    const response = await apiClient.get('/api/admin/analytics/performance');
    return response.data;
  },

  // Content Moderation
  async getFlaggedMusic(page = 0, size = 10): Promise<{ content: FlaggedMusic[]; totalElements: number }> {
    const response = await apiClient.get(`/api/admin/music/flagged?page=${page}&size=${size}`);
    return response.data;
  },

  async unflagMusic(musicId: number): Promise<void> {
    await apiClient.post(`/api/admin/music/${musicId}/unflag`);
  },

  async deleteFlaggedMusic(musicId: number): Promise<void> {
    await apiClient.delete(`/api/admin/music/${musicId}/flagged`);
  },

  // Review Management
  async getAllReviews(page = 0, size = 10, sortBy = 'date'): Promise<{ content: AdminReview[]; totalElements: number }> {
    const response = await apiClient.get(`/api/admin/reviews?page=${page}&size=${size}&sortBy=${sortBy}`);
    return response.data;
  },

  async deleteReview(reviewId: number): Promise<void> {
    await apiClient.delete(`/api/admin/reviews/${reviewId}`);
  },

  // Order Management
  async getAllOrders(page = 0, size = 10, status?: string): Promise<{ content: AdminOrder[]; totalElements: number }> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (status) params.append('status', status);

    const response = await apiClient.get(`/api/admin/orders?${params}`);
    return response.data;
  },

  async processRefund(orderId: number, reason?: string): Promise<void> {
    await apiClient.post(`/api/admin/orders/${orderId}/refund`, { reason });
  },

  // Ticket Management
  async getAllTickets(page = 0, size = 10, status?: string): Promise<{ content: AdminTicket[]; totalElements: number }> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (status) params.append('status', status);

    const response = await apiClient.get(`/api/admin/tickets?${params}`);
    return response.data;
  },

  async assignTicket(ticketId: number, staffId: number): Promise<void> {
    await apiClient.post(`/api/admin/tickets/${ticketId}/assign`, { staffId });
  },

  async updateTicketStatus(ticketId: number, status: string): Promise<void> {
    await apiClient.put(`/api/admin/tickets/${ticketId}/status`, { status });
  },

  // System Management
  async getSystemStatus(): Promise<{ status: string; version: string; uptime: string }> {
    const response = await apiClient.get('/api/admin/system/status');
    return response.data;
  },

  async shutdownServer(delaySeconds = 0, reason?: string): Promise<void> {
    const params = new URLSearchParams({ delaySeconds: delaySeconds.toString() });
    if (reason) params.append('reason', reason);

    await apiClient.post(`/api/admin/system/shutdown?${params}`);
  }
};

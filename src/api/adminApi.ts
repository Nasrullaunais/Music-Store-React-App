import { apiClient } from '@/services/api';
import {Music} from "@/types";

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
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedUntil?: string;
  bannedBy?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  email: string;
  role: 'CUSTOMER' | 'ARTIST' | 'STAFF' | 'ADMIN';
  firstName?: string;
  lastName?: string;
}

export interface StaffRegistrationRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  position?: string;
}

export interface AdminRegistrationRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface BanRequest {
  reason: string;
  durationInHours: number;
}

export interface BanResponse {
  userId: number;
  username: string;
  email: string;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedUntil?: string;
  bannedBy?: string;
  message: string;
}

export interface BannedUserDto {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  banReason: string;
  bannedAt: string;
  bannedUntil: string;
  bannedBy: string;
  hoursRemaining: number;
}

export interface BannedUsersResponse {
  content: BannedUserDto[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AllBannedUsersResponse {
  bannedUsers: BannedUserDto[];
  totalCount: number;
  timestamp: string;
}

export interface BanStatistics {
  totalBanned: number;
  bannedCustomers: number;
  bannedArtists: number;
  expiringSoon: number;
  timestamp: string;
}

export interface TopProduct {
  productName: string;
  artistName: string;
  quantitySold: number;
  revenue: number;
}

export interface DailySales {
  day: number;
  sales: number;
  orders: number;
}

export interface MonthlySalesData {
  month: number;
  year: number;
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  topProducts: TopProduct[];
  dailySales: DailySales[];
}

export interface StaffUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  position?: string;
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
  musicId?: number;
  // Backend may return nested music object instead of musicId
  music?: {
    id?: number;
    name?: string;
    title?: string;
    artist?: string;
    artistUsername?: string;
    imageUrl?: string;
    price?: number;
  };
  customerUsername?: string;
  customerName?: string;
  // Backend may return nested customer object
  customer?: {
    id?: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  rating: number;
  comment: string; // backend uses 'comment' instead of 'content'
  createdAt: string;
  updatedAt?: string;
}

export interface AdminOrder {
  id: number;
  customer: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  customerUsername?: string; // For backward compatibility
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  orderItems: {
    id: number;
    product: Music;
    quantity: number;
    price: number;
  }[];
}

export interface AdminTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  customerUsername: string;
  customerName?: string; // Transient field from backend
  assignedStaffUsername?: string;
  assignedStaffName?: string; // Transient field from backend
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  // Additional customer information if available
  customer?: {
    id?: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
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

  async banCustomer(customerId: number, banData: BanRequest): Promise<BanResponse> {
    const response = await apiClient.post(`/api/admin/customers/${customerId}/ban`, banData);
    return response.data;
  },

  async unbanCustomer(customerId: number): Promise<BanResponse> {
    const response = await apiClient.delete(`/api/admin/customers/${customerId}/ban`);
    return response.data;
  },

  async banArtist(artistId: number, banData: BanRequest): Promise<BanResponse> {
    const response = await apiClient.post(`/api/admin/artists/${artistId}/ban`, banData);
    return response.data;
  },

  async unbanArtist(artistId: number): Promise<BanResponse> {
    const response = await apiClient.delete(`/api/admin/artists/${artistId}/ban`);
    return response.data;
  },

  async getCustomerBanStatus(customerId: number): Promise<BanResponse> {
    const response = await apiClient.get(`/api/admin/customers/${customerId}/ban-status`);
    return response.data;
  },

  async getArtistBanStatus(artistId: number): Promise<BanResponse> {
    const response = await apiClient.get(`/api/admin/artists/${artistId}/ban-status`);
    return response.data;
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
  async getAllTickets(status?: string): Promise<{ content: AdminTicket[]; totalElements: number }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await apiClient.get(`/api/admin/tickets?${params}`);
    return response.data;
  },

  // Fetch staff users to populate assignment dropdown
  async getStaffUsers(): Promise<AdminUser[]> {
    // Backend endpoint should support role filter; fall back to all users if not
    const response = await apiClient.get('/api/admin/users?role=STAFF&page=0&size=100');
    // Response might be a paged object or array
    const data: any = response.data;
    if (Array.isArray(data)) return data as AdminUser[];
    return (data.content || []) as AdminUser[];
  },

  async assignTicket(ticketId: number, staffId: number): Promise<AdminTicket> {
    // New backend endpoint expects staffId as a path parameter and returns the updated Ticket
    const response = await apiClient.put(`/api/admin/tickets/${ticketId}/assign/${staffId}`);
    return response.data;
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
  },

  // Staff and Admin Registration
  async registerStaff(staffData: StaffRegistrationRequest): Promise<StaffUser> {
    const response = await apiClient.post('/api/admin/staff/register', staffData);
    return response.data;
  },

  async registerAdmin(adminData: AdminRegistrationRequest): Promise<AdminUser> {
    const response = await apiClient.post('/api/admin/admin/register', adminData);
    return response.data;
  },

  // Refund Management
  async getAllRefunds(page = 0, size = 10, status?: string): Promise<{ content: any[]; totalElements: number }> {
    const params = new URLSearchParams({ page: page.toString(), size: size.toString() });
    if (status) params.append('status', status);

    const response = await apiClient.get(`/api/admin/refunds?${params}`);
    return response.data;
  },

  async getRefundById(refundId: number): Promise<any> {
    const response = await apiClient.get(`/api/admin/refunds/${refundId}`);
    return response.data;
  },

  async getRefundStatistics(): Promise<any> {
    const response = await apiClient.get('/api/admin/refunds/statistics');
    return response.data;
  },

  async approveRefund(refundId: number, adminNotes?: string): Promise<void> {
    await apiClient.put(`/api/admin/refunds/${refundId}/approve`, { adminNotes });
  },

  async rejectRefund(refundId: number, adminNotes: string): Promise<void> {
    await apiClient.put(`/api/admin/refunds/${refundId}/reject`, { adminNotes });
  },

  // Banned Users Management
  async getBannedUsers(page = 0, size = 10): Promise<BannedUsersResponse> {
    const response = await apiClient.get(`/api/admin/banned-users?page=${page}&size=${size}`);
    return response.data;
  },

  async getAllBannedUsers(): Promise<AllBannedUsersResponse> {
    const response = await apiClient.get('/api/admin/banned-users/all');
    return response.data;
  },

  async getBanStatistics(): Promise<BanStatistics> {
    const response = await apiClient.get('/api/admin/banned-users/statistics');
    return response.data;
  },

  // Sales Reports
  async downloadMonthlySalesReport(year: number, month: number): Promise<Blob> {
    const response = await apiClient.get(`/api/admin/reports/sales/monthly`, {
      params: { year, month },
      responseType: 'blob'
    });
    return response.data;
  },

  async getMonthlySalesData(year: number, month: number): Promise<MonthlySalesData> {
    const response = await apiClient.get(`/api/admin/reports/sales/monthly/data`, {
      params: { year, month }
    });
    return response.data;
  },
};

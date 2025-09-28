import { apiClient as api } from '@/services/api';
import { Music } from '@/types';

// Artist Dashboard Stats Interface
export interface ArtistDashboardStats {
  totalTracks: number;
  salesAnalytics: {
    totalTracks: number;
    totalSales: number;
    totalRevenue: number;
    topTracks: Array<{
      id: number;
      name: string;
      averageRating: number;
      totalReviews: number;
    }>;
    genreDistribution: Record<string, number>;
    recentUploads: number;
  };
  reviewAnalytics: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
    recentReviews: number;
    topRatedTracks: Array<{
      id: number;
      name: string;
      averageRating: number;
    }>;
  };
}

// Music Upload Data Interface - matching backend expectations
export interface MusicUploadData {
  title: string;
  genre: string;
  price: number;
  description?: string;
  albumName?: string;
  releaseYear?: number;
}

// Music Update Data Interface - matching backend MusicDto structure
export interface MusicUpdateData {
  name: string;
  description?: string;
  price: number;
  genre: string;
  albumName?: string;
  releaseYear?: number;
}

// Paginated Music Response
export interface PaginatedMusicResponse {
  music: Music[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// Review Interface
export interface Review {
  id: number;
  rating: number;
  comment: string;
  customerUsername: string;
  createdAt: string;
}

// Artist Profile Interface
export interface ArtistProfile {
  username: string;
  authorities: string[];
  totalTracks: number;
}

class ArtistAPI {
  private baseURL = '/api/artist';

  // Dashboard and Analytics
  async getDashboardStats(): Promise<ArtistDashboardStats> {
    const response = await api.get(`${this.baseURL}/dashboard-stats`);
    return response.data.data;
  }

  async getSalesAnalytics() {
    const response = await api.get(`${this.baseURL}/analytics/sales`);
    return response.data.data;
  }

  async getReviewAnalytics() {
    const response = await api.get(`${this.baseURL}/analytics/reviews`);
    return response.data.data;
  }

  // Music Management - Updated to match backend exactly
  async uploadMusic(musicData: MusicUploadData, musicFile: File, coverImage: File): Promise<Music> {
    const formData = new FormData();

    // Match exact backend parameter names (only the ones backend accepts)
    formData.append('title', musicData.title);
    formData.append('genre', musicData.genre);
    formData.append('price', musicData.price.toString());

    if (musicData.description) {
      formData.append('description', musicData.description);
    }

    // Note: Backend doesn't accept albumName or releaseYear in upload endpoint
    // These would need to be added to backend if required

    // Backend expects these files with exact names
    formData.append('musicFile', musicFile);
    formData.append('coverImage', coverImage);

    const response = await api.post(`${this.baseURL}/music/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  async getMyMusic(page: number = 0, size: number = 10): Promise<PaginatedMusicResponse> {
    const response = await api.get(`${this.baseURL}/music/my-music`, {
      params: { page, size }
    });
    return response.data.data;
  }

  async getMusicCount(): Promise<number> {
    const response = await api.get(`${this.baseURL}/music/count`);
    return response.data.data.count;
  }

  async updateMusic(musicId: number, updateData: MusicUpdateData): Promise<Music> {
    // Transform frontend data to match backend MusicDto structure
    const musicDto = {
      name: updateData.name,
      description: updateData.description,
      price: updateData.price,
      genre: updateData.genre,
      albumName: updateData.albumName,
      releaseYear: updateData.releaseYear
    };

    const response = await api.put(`${this.baseURL}/music/${musicId}`, musicDto);
    return response.data.data;
  }

  async deleteMusic(musicId: number): Promise<void> {
    await api.delete(`${this.baseURL}/music/${musicId}`);
  }

  // Review Management
  async getMusicReviews(musicId: number): Promise<Review[]> {
    const response = await api.get(`${this.baseURL}/music/${musicId}/reviews`);
    return response.data.data;
  }

  // Profile
  async getProfile(): Promise<ArtistProfile> {
    const response = await api.get(`${this.baseURL}/profile`);
    return response.data.data;
  }
}

export const artistAPI = new ArtistAPI();

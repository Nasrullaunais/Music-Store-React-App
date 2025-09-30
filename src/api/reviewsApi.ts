import { apiClient } from '@/services/api';
import { Review, CreateReviewRequest, UpdateReviewRequest, ReviewsResponse, ReviewStats } from '@/types';

// Get authentication token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Set authorization header for authenticated requests
const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create a review for a music track
 * POST /api/reviews/music/{musicId}
 */
export const createReview = async (musicId: number, reviewData: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post(
        `/api/reviews/music/${musicId}`,
        reviewData,
        { headers: getAuthHeaders() }
    );
    return response.data;
};

/**
 * Update an existing review
 * PUT /api/reviews/{reviewId}
 */
export const updateReview = async (reviewId: number, reviewData: UpdateReviewRequest): Promise<Review> => {
    const response = await apiClient.put(
        `/api/reviews/${reviewId}`,
        reviewData,
        { headers: getAuthHeaders() }
    );
    return response.data;
};

/**
 * Delete a review
 * DELETE /api/reviews/{reviewId}
 */
export const deleteReview = async (reviewId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(
        `/api/reviews/${reviewId}`,
        { headers: getAuthHeaders() }
    );
    return response.data;
};

/**
 * Get paginated reviews for a specific music track
 * GET /api/reviews/music/{musicId}
 */
export const getMusicReviews = async (
    musicId: number, 
    page: number = 0, 
    size: number = 10
): Promise<ReviewsResponse> => {
    const response = await apiClient.get(
        `/api/reviews/music/${musicId}`,
        { params: { page, size } }
    );
    return response.data;
};

/**
 * Get the current user's review for a specific music track
 * GET /api/reviews/music/{musicId}/my-review
 */
export const getUserReviewForMusic = async (musicId: number): Promise<Review | null> => {
    try {
        const response = await apiClient.get(
            `/api/reviews/music/${musicId}/my-review`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error: any) {
        // Return null if no review found (404)
        if (error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

/**
 * Get review statistics for a music track
 * GET /api/reviews/music/{musicId}/stats
 */
export const getMusicReviewStats = async (musicId: number): Promise<ReviewStats> => {
    const response = await apiClient.get(`/api/reviews/music/${musicId}/stats`);
    return response.data;
};

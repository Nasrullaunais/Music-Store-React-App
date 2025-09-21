import {apiClient, API_ENDPOINTS} from  '@/services/api';
import {Music} from "@/types";

export const fetchMyPurchasedMusic = async (): Promise<Music[]> => {
    try {
        const response = await apiClient.get(API_ENDPOINTS.MUSIC.PURCHASED);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch my music');
    }
};
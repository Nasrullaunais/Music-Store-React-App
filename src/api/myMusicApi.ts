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

// Add flagging API helper
export const flagMusic = async (musicId: number, reason: string): Promise<void> => {
    try {
        await apiClient.post(`/api/music/${musicId}/flag`, { reason });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to flag music');
    }
};

// Retrieve flag status for current customer for a given music
export const getMusicFlagStatus = async (musicId: number): Promise<{ isFlagged: boolean; musicId: number; customerId?: number }> => {
    try {
        const res = await apiClient.get(`/api/music/${musicId}/flag-status`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to get flag status');
    }
};

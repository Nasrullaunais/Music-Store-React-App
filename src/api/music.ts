import {Music} from "@/types";
import api, { API_ENDPOINTS} from "@/services/api.ts";

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export const fetchAllMusic = async (page = 0, size = 100, search?: string): Promise<PaginatedResponse<Music>> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        const response = await api.get(API_ENDPOINTS.MUSIC.GET_ALL, { params });
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch music');
    }
}

export const fetchMusicById = async (id: number): Promise<Music> => {
    try {
        const response = await api.get(API_ENDPOINTS.MUSIC.GET_BY_ID(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch music');
    }
}

export const fetchFeaturedMusic = async (): Promise<Music[]> => {
    try {
        const response = await api.get(API_ENDPOINTS.MUSIC.FEATURED);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch featured music');
    }
}

export const fetchbyGenre = async (genre: string): Promise<Music[]> => {
    try{
        const response = await api.get(API_ENDPOINTS.MUSIC.GET_ALL, { params: { genre } });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch music');
    }
};

export const searchMusic = async (search: string): Promise<Music[]> => {
    try{
        const response = await api.get(API_ENDPOINTS.MUSIC.SEARCH, { params: { search } });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to search music');
    }
};
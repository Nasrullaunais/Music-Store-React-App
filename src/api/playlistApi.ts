import apiClient from '../services/api';
import { Playlist } from '@/types';

export interface PlaylistCreateRequest {
    name: string;
}

export interface PlaylistUpdateRequest {
    name: string;
}

export interface PlaylistResponse {
    success: boolean;
    message: string;
    data: Playlist;
}

export interface PlaylistsResponse {
    success: boolean;
    message: string;
    count: number;
    data: Playlist[];
}

export interface PlaylistWithMusicResponse {
    success: boolean;
    message: string;
    data: Playlist & {
        musics: any[];
    };
}

export interface ApiSuccessResponse {
    success: boolean;
    message: string;
}

// Create a new playlist
export const createPlaylist = async (name: string): Promise<Playlist> => {
    const response = await apiClient.post<PlaylistResponse>('/api/playlists', {
        name
    });
    return response.data.data;
};

// Get all user playlists
export const getUserPlaylists = async (): Promise<Playlist[]> => {
    const response = await apiClient.get<PlaylistsResponse>('/api/playlists');
    return response.data.data;
};

// Get playlist with music tracks
export const getPlaylistWithMusic = async (playlistId: number): Promise<Playlist & { musics: any[] }> => {
    const response = await apiClient.get<PlaylistWithMusicResponse>(`/api/playlists/${playlistId}`);
    return response.data.data;
};

// Update playlist name
export const updatePlaylist = async (playlistId: number, name: string): Promise<Playlist> => {
    const response = await apiClient.put<PlaylistResponse>(`/api/playlists/${playlistId}`, {
        name
    });
    return response.data.data;
};

// Delete playlist
export const deletePlaylist = async (playlistId: number): Promise<void> => {
    await apiClient.delete<ApiSuccessResponse>(`/api/playlists/${playlistId}`);
};

// Add music to playlist
export const addMusicToPlaylist = async (playlistId: number, musicId: number): Promise<Playlist & { musics: any[] }> => {
    const response = await apiClient.post<PlaylistWithMusicResponse>(`/api/playlists/${playlistId}/music/${musicId}`);
    return response.data.data;
};

// Remove music from playlist
export const removeMusicFromPlaylist = async (playlistId: number, musicId: number): Promise<Playlist & { musics: any[] }> => {
    const response = await apiClient.delete<PlaylistWithMusicResponse>(`/api/playlists/${playlistId}/music/${musicId}`);
    return response.data.data;
};

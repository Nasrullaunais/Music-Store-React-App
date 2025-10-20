import {LoginCredentials, RegisterData, User} from "@/types";
import api, { API_ENDPOINTS} from "@/services/api.ts";

export interface BanErrorResponse {
    message: string;
    errorType: string;
    banReason?: string;
    bannedUntil?: string;
    timestamp?: string;
}

export const registerUser = async (userData: RegisterData): Promise<User> => {
    try{
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        const {token, user} = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error: any){
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
}

export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
    try{
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        const {token, user} = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error: any){
        // Check if this is a ban error (403 status with ACCOUNT_BANNED errorType)
        if (error.response?.status === 403 && error.response?.data?.errorType === 'ACCOUNT_BANNED') {
            const banError = error.response.data as BanErrorResponse;
            // Throw a special error object that includes all ban details
            const banErrorObj = new Error(banError.message) as any;
            banErrorObj.isBanError = true;
            banErrorObj.banDetails = banError;
            throw banErrorObj;
        }
        throw new Error(error.response?.data?.message || 'Login failed');
    }
}

export const getCurrentUser = async (): Promise<User> => {
    try{
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        return response.data;
    } catch (error: any){
        throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
}

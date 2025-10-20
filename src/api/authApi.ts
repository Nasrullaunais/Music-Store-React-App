import {LoginCredentials, RegisterData, User} from "@/types";
import api, { API_ENDPOINTS} from "@/services/api.ts";

export interface BanErrorResponse {
    message: string;
    errorType: string;
    banReason?: string;
    bannedUntil?: string;
    timestamp?: string;
}

// Password Reset Types
export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface PasswordResetResponse {
    message: string;
    success: boolean;
}

export interface TokenValidationResponse {
    valid: boolean;
    message: string;
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

// Password Reset Functions
export const forgotPassword = async (email: string): Promise<PasswordResetResponse> => {
    try {
        const response = await api.post('/api/password/forgot', { email });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
}

export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResponse> => {
    try {
        const response = await api.post('/api/password/reset', { token, newPassword });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
}

export const validateResetToken = async (token: string): Promise<TokenValidationResponse> => {
    try {
        const response = await api.get(`/api/password/validate-token?token=${token}`);
        return response.data;
    } catch (error: any) {
        return {
            valid: false,
            message: error.response?.data?.message || 'Failed to validate token'
        };
    }
}

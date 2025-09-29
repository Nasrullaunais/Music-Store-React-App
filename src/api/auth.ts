import {LoginCredentials, RegisterData, User} from "@/types";
import api, { API_ENDPOINTS} from "@/services/api.ts";





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

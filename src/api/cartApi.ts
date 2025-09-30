// Cart API functions for Music Store Frontend
import { apiClient, API_ENDPOINTS } from '@/services/api';
import { Cart } from '@/types';

export const cartApi = {
    // Get current user's cart
    getCart: async (): Promise<Cart> => {
        const response = await apiClient.get(API_ENDPOINTS.CART.GET);
        return response.data;
    },

    // Add music to cart
    addToCart: async (musicId: number): Promise<Cart> => {
        const response = await apiClient.post(API_ENDPOINTS.CART.ADD(musicId));
        return response.data;
    },

    // Remove item from cart
    removeFromCart: async (itemId: number): Promise<Cart> => {
        const response = await apiClient.delete(API_ENDPOINTS.CART.REMOVE(itemId));
        return response.data;
    },

    // Clear all items from cart
    clearCart: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CART.CLEAR);
    },

    // Checkout cart
    checkout: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CART.CHECKOUT);
    },
};

export default cartApi;

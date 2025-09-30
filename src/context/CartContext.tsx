import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {Cart, Music} from '@/types';
import { cartApi } from '@/api/cartApi.ts';
import {fetchMyPurchasedMusic} from "@/api/myMusicApi.ts";
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    itemCount: number;
    addToCart: (musicId: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    checkout: () => Promise<void>;
    isInCart: (musicId: number) => boolean;
    isMyMusic: (musicId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const [myMusic, setMyMusic] = useState<Music[]>([]);
    const { user } = useAuth();

    const refreshCart = async () => {
        // Only load cart for customers - artists don't have carts
        if (!user || user.role !== 'CUSTOMER') {
            setCart(null);
            return;
        }

        try {
            setLoading(true);
            const cartData = await cartApi.getCart();
            setCart(cartData);
        } catch (error: any) {
            console.error('Error fetching cart:', error);
            // Don't show error toast for 401/403 as it means user doesn't have cart access
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                toast.error('Failed to load cart');
            }
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (musicId: number) => {
        try {
            const updatedCart = await cartApi.addToCart(musicId);
            setCart(updatedCart);
            toast.success('Added to cart successfully');
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 400) {
                toast.warning('Item is already in your cart');
            } else {
                toast.error('Failed to add item to cart');
            }
            throw error;
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            const updatedCart = await cartApi.removeFromCart(itemId);
            setCart(updatedCart);
            toast.success('Item removed from cart');
        } catch (error: any) {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove item from cart');
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await cartApi.clearCart();
            setCart(cart ? { ...cart, items: [], totalPrice: 0 } : null);
            toast.success('Cart cleared successfully');
        } catch (error: any) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
            throw error;
        }
    };

    const checkout = async () => {
        if (!cart || cart.items.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }

        try {
            setLoading(true);
            await cartApi.checkout();
            toast.success('Purchase completed successfully!');
            // Refresh to get updated cart state (likely empty)
            await refreshCart();
        } catch (error: any) {
            console.error('Error during checkout:', error);
            toast.error('Checkout failed. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const isInCart = (musicId: number): boolean => {
        if (!cart) return false;
        return cart.items.some(item => item.music.id === musicId);
    };

    const isMyMusic = (musicId: number): boolean => {
        if (!myMusic) return false;
        return myMusic.some(item => item.id === musicId);
    }

    const itemCount = cart?.items.length || 0;

    // Load cart when user changes and is a customer
    useEffect(() => {
        if (user && user.role === 'CUSTOMER') {
            refreshCart();
        } else {
            setCart(null);
        }
    }, [user]);

    useEffect(() => {
        const loadMyMusic = async () => {
            if (user && user.role === 'CUSTOMER') {
                try {
                    const music = await fetchMyPurchasedMusic();
                    setMyMusic(music);
                } catch (error) {
                    console.error('Error fetching purchased music:', error);
                }
            } else {
                setMyMusic([]);
            }
        };
        loadMyMusic();
    }, [user]);

    const value: CartContextType = {
        cart,
        loading,
        itemCount,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart,
        checkout,
        isInCart,
        isMyMusic,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;

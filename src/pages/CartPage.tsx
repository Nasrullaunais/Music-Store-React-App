import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { cartApi } from '@/api/cart';

const CartPage: React.FC = () => {
    const { cart, loading, removeFromCart, clearCart, refreshCart } = useCart();
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

    // Fetch cart data on component mount
    useEffect(() => {
        refreshCart();
    }, []);

    const handleRemoveItem = async (itemId: number) => {
        try {
            setRemovingItems(prev => new Set(prev).add(itemId));
            await removeFromCart(itemId);
        } catch (error: any) {
            // Error handling is done in the cart context
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleClearCart = async () => {
        if (!cart || cart.items.length === 0) return;
        
        if (!window.confirm('Are you sure you want to clear your entire cart?')) {
            return;
        }

        try {
            await clearCart();
        } catch (error: any) {
            // Error handling is done in the cart context
        }
    };

    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }

        try {
            setProcessingCheckout(true);
            await cartApi.checkout();
            toast.success('Purchase completed successfully!');
            await refreshCart(); // Refresh to get updated cart state
            // Optionally redirect to a success page or purchased music page
            // navigate('/profile?tab=purchased');
        } catch (error: any) {
            console.error('Error during checkout:', error);
            toast.error('Checkout failed. Please try again.');
        } finally {
            setProcessingCheckout(false);
        }
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    const formatDuration = (duration?: number) => {
        if (!duration) return 'Unknown';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {cart?.items.length || 0} item(s) in your cart
                    </p>
                </div>

                {/* Cart Content */}
                {!cart || cart.items.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Your cart is empty
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Browse our music collection and add your favorite tracks!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item: CartItem) => (
                                <div 
                                    key={item.id} 
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
                                >
                                    <div className="flex items-center space-x-4">
                                        {/* Music Cover */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.music.imageUrl || '/placeholder-album.jpg'}
                                                alt={item.music.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-album.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Music Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                {item.music.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                by {item.music.artist}
                                            </p>
                                            {item.music.album && (
                                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                                    Album: {item.music.album}
                                                </p>
                                            )}
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {item.music.genre && (
                                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {item.music.genre}
                                                    </span>
                                                )}
                                                {item.music.duration && (
                                                    <span>{formatDuration(item.music.duration)}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price and Actions */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {formatPrice(item.totalPrice)}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={removingItems.has(item.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 
                                                         font-medium transition-colors disabled:opacity-50"
                                            >
                                                {removingItems.has(item.id) ? 'Removing...' : 'Remove'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    Order Summary
                                </h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Items ({cart.items.length})</span>
                                        <span>{formatPrice(cart.total)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                                            <span>Total</span>
                                            <span>{formatPrice(cart.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={processingCheckout || cart.items.length === 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                                                 text-white py-3 px-4 rounded-lg font-medium transition-colors
                                                 disabled:cursor-not-allowed"
                                    >
                                        {processingCheckout ? 'Processing...' : 'Checkout'}
                                    </button>
                                    
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 
                                                 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 
                                                 py-3 px-4 rounded-lg font-medium transition-colors"
                                    >
                                        Continue Shopping
                                    </button>

                                    {cart.items.length > 0 && (
                                        <button
                                            onClick={handleClearCart}
                                            className="w-full text-red-600 hover:text-red-800 dark:text-red-400 
                                                     dark:hover:text-red-300 py-2 font-medium transition-colors"
                                        >
                                            Clear Cart
                                        </button>
                                    )}
                                </div>

                                {/* Additional Info */}
                                <div className="mt-7 text-sm text-gray-500 dark:text-gray-400">
                                    <p className="mb-3">
                                        💳 Secure checkout with instant download
                                    </p>
                                    <p>
                                        🎵 High-quality audio files included
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;

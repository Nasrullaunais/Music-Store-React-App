import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/context/CartContext';
import { FiX } from 'react-icons/fi';
import { Button, Chip } from '@heroui/react';
import { CartItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (price: number) => `$${price.toFixed(2)}`;
const formatDuration = (duration?: number) => {
  if (!duration) return 'Unknown';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const { cart, loading, removeFromCart, clearCart, checkout } = useCart();
  const [removing, setRemoving] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;



  // Compute total client-side to ensure it's always visible
  const derivedTotal = cart?.items.reduce((sum, it) => {
    const unit = (it.price ?? it.music.price) ?? 0;
    const qty = it.quantity ?? 1;
    return sum + unit * qty;
  }, 0) ?? 0;

  const handleRemove = async (id: number) => {
    try {
      setRemoving(prev => new Set(prev).add(id));
      await removeFromCart(id);
    } catch (err) {
      // handled in context
    } finally {
      setRemoving(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    try {
      setProcessing(true);
      await checkout();
      // close on success
      onClose();
    } catch (err) {
      // checkout handles toasts and errors
      console.error('Checkout error from overlay:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = async () => {
    if (!cart || cart.items.length === 0) return;
    if (!confirm('Clear the entire cart?')) return;
    try {
      await clearCart();
    } catch (err) {
      // handled in context
    }
  };

  const imageUrl = `http://localhost:8082`;
  const overlay = (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop (no blur to avoid navbar visual glitch) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Card - slightly larger */}
      <div className="absolute top-16 w-[calc(100%-6rem)] max-w-sm right-10 md:top-16 md:w-full md:max-w-md lg:max-w-lg xl:max-w-xl">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, y: 20, scale: 1 }}
            exit={{ opacity: 0, x: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-indigo-200/30 dark:border-indigo-800/40 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Cart</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{cart?.items.length ?? 0} item(s)</p>
              </div>
              <div className="flex items-center gap-2">
                {cart?.items.length ? (
                  <Chip size="sm" color="danger" variant="solid" className="text-xs">
                    {cart?.items.length > 99 ? '99+' : cart?.items.length}
                  </Chip>
                ) : null}
                <button
                  aria-label="Close cart"
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors"
                >
                  <FiX className="text-indigo-600 dark:text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[65vh] overflow-y-auto p-5 space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                      </div>
                      <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>
              ) : (!cart || cart.items.length === 0) ? (
                <div className="text-center py-10 text-gray-600 dark:text-gray-400">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/></svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Your cart is empty</h4>
                  <p className="text-sm">Add tracks to your cart and they'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item: CartItem) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <img
                        src={imageUrl.concat(item.music.imageUrl ?? '/placeholder-album.jpg')}
                        alt={item.music.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {(e.target as HTMLImageElement).src = '/placeholder-album.jpg';}}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.music.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.music.artist}</p>
                          </div>
                          <div className="text-sm text-right">
                            <div className="font-medium text-gray-900 dark:text-white">{formatPrice((item.price ?? item.music.price) * (item.quantity ?? 1))}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatPrice(item.price ?? item.music.price)} x {item.quantity ?? 1}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          {item.music.genre && <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.music.genre}</span>}
                          {item.music.duration && <span>{formatDuration(item.music.duration)}</span>}
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={removing.has(item.id)}
                            className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                          >
                            {removing.has(item.id) ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-b from-white/60 dark:from-gray-900/60">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">Items</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{formatPrice(derivedTotal)}</div>
              </div>
              <div className="space-y-2">
                <Button
                  onPress={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  size="sm"
                  disabled={processing || !cart || cart.items.length === 0}
                >
                  {processing ? 'Processing...' : 'Checkout'}
                </Button>
                <Button
                  onPress={onClose}
                  variant="light"
                  className="w-full text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  size="sm"
                >
                  Continue Shopping
                </Button>

                {cart && cart.items.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="w-full text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

export default CartOverlay;

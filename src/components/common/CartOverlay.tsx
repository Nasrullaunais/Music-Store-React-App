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

const CartOverlay: React.FC<CartOverlayProps> = ({ isOpen, onClose }) => {
  const { cart, loading, removeFromCart, clearCart, checkout } = useCart();
  const [removing, setRemoving] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

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
      onClose();
    } catch (err) {
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Cart Card - Centered with glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative w-full max-w-md bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 ">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Cart</h3>
                <p className="text-sm text-gray-700">{cart?.items.length ?? 0} item(s)</p>
              </div>
              <div className="flex items-center gap-2">
                {cart?.items.length ? (
                  <Chip size="sm" color="primary" variant="flat" className="text-xs backdrop-blur-md">
                    {cart?.items.length > 99 ? '99+' : cart?.items.length}
                  </Chip>
                ) : null}
                <button
                  aria-label="Close cart"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <FiX className="text-xl text-gray-700" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[50vh] overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/40 backdrop-blur-md rounded w-3/4" />
                        <div className="h-3 bg-white/40 backdrop-blur-md rounded w-1/2" />
                      </div>
                      <div className="w-12 h-4 bg-white/40 backdrop-blur-md rounded" />
                    </div>
                  ))}
                </div>
              ) : (!cart || cart.items.length === 0) ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/></svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Your cart is empty</h4>
                  <p className="text-sm text-gray-700">Add tracks to your cart and they'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start gap-4 p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200"
                    >
                      <img
                        src={imageUrl.concat(item.music.imageUrl ?? '/placeholder-album.jpg')}
                        alt={item.music.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-md"
                        onError={(e) => {(e.target as HTMLImageElement).src = '/placeholder-album.jpg';}}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.music.name}</p>
                            <p className="text-xs text-gray-700">{item.music.artist}</p>
                          </div>
                          <div className="text-sm font-bold text-primary">
                            {formatPrice(item.unitPrice)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.music.genre && (
                            <span className="text-xs bg-primary/20 backdrop-blur-sm text-primary px-2 py-1 rounded-lg">
                              {item.music.genre}
                            </span>
                          )}
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={removing.has(item.id)}
                            className="ml-auto text-xs text-danger hover:text-danger-600 font-medium transition-colors"
                          >
                            {removing.has(item.id) ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-700">Total</div>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(cart?.total ?? 0)}
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  onPress={handleCheckout}
                  className="w-full bg-primary hover:bg-primary-600 text-white rounded-xl shadow-lg"
                  size="lg"
                  disabled={processing || !cart || cart.items.length === 0}
                >
                  {processing ? 'Processing...' : 'Checkout'}
                </Button>
                <Button
                  onPress={onClose}
                  variant="flat"
                  className="w-full text-gray-800 bg-white/30 backdrop-blur-md hover:bg-white/40 rounded-xl"
                  size="md"
                >
                  Continue Shopping
                </Button>
                {cart && cart.items.length > 0 && (
                  <Button
                    onPress={handleClear}
                    variant="light"
                    className="w-full text-danger hover:bg-danger/10 rounded-xl"
                    size="sm"
                  >
                    Clear Cart
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
};

export default CartOverlay;

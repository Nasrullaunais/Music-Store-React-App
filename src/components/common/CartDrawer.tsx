// src/components/UI/CartDrawer.tsx
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Image,
    Divider,
    Chip
} from '@heroui/react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated?: boolean;
}

const CartDrawer = ({ isOpen, onClose, isAuthenticated }: CartDrawerProps) => {
    const { items, total, removeItem, clearCart } = useCart();

    const handleRemoveItem = (itemId: number, title: string) => {
        removeItem(itemId);
        toast.success(`"${title}" removed from cart`);
    };

    const handleClearCart = () => {
        clearCart();
        toast.success('Cart cleared successfully');
    };

    const handleCheckout = () => {
        // TODO: Implement checkout logic
        if (!isAuthenticated) {
            toast.error('Please log in to checkout.');
            return;
        } else {


        }

        toast.info('Checkout functionality coming soon!');
    };

    const imageUrl = `http://localhost:8082/uploads/covers/`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Your Music Cart ({items.length} track{items.length !== 1 ? 's' : ''})
                </ModalHeader>
                <ModalBody>
                    {items.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Your cart is empty</p>
                            <p className="text-sm text-gray-400 mt-2">Add some tracks to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <Image
                                        src={imageUrl + item.imageUrl}
                                        alt={item.title}
                                        className="w-12 h-12 object-cover rounded"
                                        fallbackSrc="/logo.svg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm">{item.title}</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{item.artist}</p>
                                        {item.duration && (
                                            <Chip size="sm" variant="flat" className="text-xs mt-1">
                                                {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                                            </Chip>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="flat"
                                            onPress={() => handleRemoveItem(item.id, item.title)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {items.length > 0 && (
                        <>
                            <Divider />
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-semibold">Total: ${total.toFixed(2)}</span>
                                <Button color="danger" variant="flat" onPress={handleClearCart}>
                                    Clear Cart
                                </Button>
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onPress={onClose}>
                        Continue Shopping
                    </Button>
                    {items.length > 0 && (
                        <Button color="primary" onPress={handleCheckout}>
                            Checkout ${total.toFixed(2)}
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CartDrawer;
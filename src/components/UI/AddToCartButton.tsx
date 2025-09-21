import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
    itemId: number;
    title?: string;
    artist?: string;
    price?: number;
    image?: string;
    duration?: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    itemId
}) => {
    const { addToCart, isInCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const inCart = isInCart(itemId);

    const handleAddToCart = async () => {
        if (inCart) return;

        try {
            setIsAdding(true);
            await addToCart(itemId);
        } catch (error) {
            // Error handling is done in the cart context
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Button
            size="sm"
            color={inCart ? "success" : "primary"}
            variant={inCart ? "flat" : "solid"}
            onPress={handleAddToCart}
            isDisabled={inCart || isAdding}
            startContent={
                inCart ? <FiCheck size={16} /> : <FiShoppingCart size={16} />
            }
            className={`
                min-w-fit px-3 py-2 text-xs font-medium transition-all duration-200
                ${inCart 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
                ${isAdding ? 'opacity-75' : ''}
            `}
        >
            {isAdding ? 'Adding...' : inCart ? 'In Cart' : 'Add to Cart'}
        </Button>
    );
};

export default AddToCartButton;

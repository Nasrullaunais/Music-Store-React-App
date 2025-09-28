import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

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
    const { addToCart, isInCart, isMyMusic} = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);

    const inCart = isInCart(itemId);
    const myMusic = isMyMusic(itemId);

    const handleAddToCart = async () => {
        if (inCart) return;

        // Check if user is authenticated
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }

        if (myMusic) {
            toast.info("You cannot add your own music to the cart.");
            return;
        }

        try {
            setIsAdding(true);
            await addToCart(itemId);
        } catch (error: any) {
            // Handle 401 authentication errors specifically
            if (error.response?.status === 401) {
                navigate('/auth');
            }
            // Other error handling is done in the cart context
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
                ${myMusic
                    ? 'bg-purple-100 text-purple-700 dark:bg-indigo-900/50  dark:text-indigo-200' 
                    : 'bg-primary hover:bg-primary text-white'
                }
                ${inCart
            ? 'bg-success hover:bg-success text-black dark:bg-success dark:text-white dark:hover:bg-success/20'
            : 'bg-primary hover:bg-primary text-white'}
                ${isAdding ? 'opacity-75' : ''}
                ${inCart ? 'cursor-not-allowed ' : ''}
                ${myMusic ? 'cursor-not-allowed opacity-75' : ''}
               
            `}
        >
            {inCart ? 'In Cart' : myMusic ? 'Owned' : isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
    );
};

export default AddToCartButton;

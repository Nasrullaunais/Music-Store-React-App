import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Button} from "@heroui/react";
import {useState} from "react";
import {useCart} from "../../context/CartContext";
import { toast } from 'react-toastify';

interface AddToCartButtonProps {
    itemId: number;
    title: string;
    artist: string;
    price: number;
    image: string;
    duration?: number;
}

const AddToCartButton = ({ itemId, title, artist, price, image, duration }: AddToCartButtonProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const {addItem, isInCart} = useCart();
    const [loading, setLoading] = useState(false);

    const isTrackInCart = isInCart(itemId);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            toast.error('Please log in to add items to your cart.');
            navigate('/auth');
            return;
        }

        if(isTrackInCart) {
            toast.info('This track is already in your cart!');
            return;
        }

        setLoading(true);
        try {
            addItem({
                id: itemId,
                title,
                artist,
                price,
                imageUrl: image,
                duration
            });
            toast.success(`"${title}" by ${artist} added to cart!`);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Failed to add item to cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onPress={handleAddToCart}
            isLoading={loading}
            isDisabled={isTrackInCart}
            className={isTrackInCart ? "text-gray-700" : "text-indigo-950 hover:text-indigo-700"}
            variant={isTrackInCart ? "shadow" : "faded"}
            color={isTrackInCart ? "default" : "primary"}
            size="sm"
            radius="full"
        >
            {isTrackInCart ? "In Cart" : "Add to Cart"}
        </Button>
    );
};

export default AddToCartButton;
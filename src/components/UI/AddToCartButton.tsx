import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AddToCartButtonProps {
    itemId: number;
}

const AddToCartButton = ({ itemId }: AddToCartButtonProps) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            // If the user is not logged in, redirect them to the auth page
            alert('Please log in to add items to your cart.');
            navigate('/auth');
            return;
        }
        // TODO: Implement the actual add-to-cart logic here
        console.log(`Item with ID ${itemId} added to cart!`);
    };

    return (
        <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
            Add to Cart
        </button>
    );
};

export default AddToCartButton;
import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
    id: number;
    title: string;
    artist: string;
    price: number;
    imageUrl: string;
    duration?: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    totalAmount: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: { id: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    loadCart: (items: CartItem[]) => void;
    isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if(existingItem) {
                return state;
            }

            const newItems = [...state.items, action.payload];
            return calculateTotals(newItems);
        }
        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload.id);
            return calculateTotals(newItems);
        }

        case 'CLEAR_CART': {
            return { items: [], total: 0, totalAmount: 0 };
        }

        case 'LOAD_CART': {
            return calculateTotals(action.payload);
        }
        default:
            return state;
    }
}

const calculateTotals = (items: CartItem[]): CartState => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const totalAmount = items.length;
    return { items, total, totalAmount };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        total: 0,
        totalAmount: 0
    });

    const addItem = (item: CartItem) => {
        dispatch({type: 'ADD_ITEM', payload: item});
    };

    const removeItem = (id: number) => {
        dispatch({type: 'REMOVE_ITEM', payload: { id }});
    };

    const clearCart = () => {
        dispatch({type: 'CLEAR_CART'});
    };

    const loadCart = (items: CartItem[]) => {
        dispatch({type: 'LOAD_CART', payload: items});
    };

    const isInCart = (id: number) => {
        return state.items.some(item => item.id === id);
    };

    return (
        <CartContext.Provider value={{
            ...state,
            addItem,
            removeItem,
            clearCart,
            loadCart,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

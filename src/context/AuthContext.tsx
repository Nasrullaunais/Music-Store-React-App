import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { getCurrentUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import {Spinner} from "@heroui/react";

// Define the shape of our context value
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider
interface AuthProviderProps {
    children: ReactNode;
}

// Create the Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for an existing token on app load
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            getCurrentUser()
                .then(currentUser => {
                    setUser(currentUser);
                    // Role-based redirect for existing sessions
                    const currentPath = window.location.pathname;
                    if (currentPath === '/' || currentPath === '/auth') {
                        if (currentUser.role === 'ADMIN') {
                            navigate('/admin');
                        } else if (currentUser.role === 'STAFF') {
                            navigate('/staff');
                        }
                    }
                })
                .catch(() => {
                    // If token is invalid, clear it and user
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [navigate]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth'); // Redirect to login page
    };

    const isAuthenticated = !!user;

    const Value = {
        user,
        isAuthenticated,
        login,
        logout,
        loading,
    };

    if (loading) {
        return <Spinner variant="wave"/>;
    }

    return <AuthContext.Provider value={Value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
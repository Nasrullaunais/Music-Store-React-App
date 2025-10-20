import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {loginUser, registerUser, BanErrorResponse} from "../api/authApi.ts";
import Register from "../components/UI/Register";
import Login from "../components/UI/Login";
import BanNotificationModal from "../components/UI/BanNotificationModal";
import { LoginCredentials, RegisterData } from '@/types';
import {useAuth} from "@/context/AuthContext.tsx";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [banDetails, setBanDetails] = useState<BanErrorResponse | null>(null);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const {login} = useAuth();

    const getErrorMessage = (errorMessage: string) => {
        // Map technical error messages to user-friendly ones
        if (errorMessage.includes('Invalid username or password')) {
            return 'The username or password you entered is incorrect. Please try again.';
        }
        if (errorMessage.includes('User already exists') || errorMessage.includes('Username already taken')) {
            return 'This username is already taken. Please choose a different one.';
        }
        if (errorMessage.includes('Email already exists')) {
            return 'An account with this email already exists. Please sign in or use a different email.';
        }
        if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
            return 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        return errorMessage;
    };

    const handleLogin = async (credentials: LoginCredentials) => {
        try {
            setError(null);
            const user = await loginUser(credentials);
            login(user)

            // Role-based redirect
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else if (user.role === 'STAFF') {
                navigate('/staff');
            } else if (user.role === 'ARTIST') {
                navigate('/artist');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            // Check if this is a ban error
            if (error.isBanError && error.banDetails) {
                setBanDetails(error.banDetails);
                setIsBanModalOpen(true);
                setError(null);
            } else {
                // Regular error handling with friendly messages
                setError(getErrorMessage(error.message));
            }
        }
    };

    const handleRegister = async (userData: RegisterData) => {
        try {
            setError(null);
            const user = await registerUser(userData);
            login(user)

            // Role-based redirect
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else if (user.role === 'STAFF') {
                navigate('/staff');
            } else if (user.role === 'ARTIST') {
                navigate('/artist');
            } else {
                navigate('/');
            }
        } catch (error: any) {
            setError(getErrorMessage(error.message));
        }
    };

    const handleCloseBanModal = () => {
        setIsBanModalOpen(false);
        setBanDetails(null);
    };

    return (
        <div className="flex w-4/5 h-screen items-center justify-center">
            <div className="w-2/5 backdrop-brightness-110 rounded-large p-8">
                {isLogin ? (
                <Login
                    onLogin={handleLogin}
                    onSwitchToRegister={() => {
                        setIsLogin(false);
                        setError(null);
                    }}
                    error={error}
                />
                ) : (
                <Register
                    onRegister={handleRegister}
                    onSwitchToLogin={() => {
                        setIsLogin(true);
                        setError(null);
                    }}
                    error={error}
                />
            )}
            </div>

            {/* Ban Notification Modal */}
            {banDetails && (
                <BanNotificationModal
                    isOpen={isBanModalOpen}
                    onClose={handleCloseBanModal}
                    banDetails={banDetails}
                />
            )}
        </div>
    );
};

export default AuthPage;

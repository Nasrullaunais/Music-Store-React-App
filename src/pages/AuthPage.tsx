import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {loginUser, registerUser} from "../api/authApi.ts";
import Register from "../components/UI/Register";
import Login from "../components/UI/Login";
import { LoginCredentials, RegisterData } from '@/types';
import {useAuth} from "@/context/AuthContext.tsx";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const {login} = useAuth();

    const handleLogin = async (credentials: LoginCredentials) => {
        try {
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
            // You can handle errors here, e.g., by setting an error message state
            setError(error.message);
        }
    };

    const handleRegister = async (userData: RegisterData) => {
        try {
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
            setError(error.message);
        }
    };

    return (
        <div className="flex w-4/5 h-screen items-center justify-center">
            <div className="w-2/5 backdrop-brightness-110 rounded-large p-8">
                {error && <p className="text-red-500 text-sm align-middle justify-center">{error}</p>}
                {isLogin ? (
                <Login onLogin={handleLogin} onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                <Register onRegister={handleRegister} onSwitchToLogin={() => setIsLogin(true)} />
            )}
            </div>
        </div>
    );
};

export default AuthPage;
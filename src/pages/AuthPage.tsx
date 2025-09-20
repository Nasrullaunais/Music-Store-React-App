import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {loginUser, registerUser} from "../api/auth";
import Register from "../components/UI/Register";
import Login from "../components/UI/Login";
import { LoginCredentials, RegistrationData } from '@/types';
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
            navigate('/'); // Redirect on success
        } catch (error: any) {
            // You can handle errors here, e.g., by setting an error message state
            setError(error.message);
        }
    };

    const handleRegister = async (userData: RegistrationData) => {
        try {
            const user = await registerUser(userData);
            login(user)
            navigate('/'); // Redirect on success
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="flex w-screen h-screen items-center justify-center">
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
import  {ReactNode} from "react";
import {useAuth} from "@/context/AuthContext.tsx";
import {Navigate} from "react-router-dom";

interface ProtectedRoutesProps {
    children:   ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRoutesProps) => {
    const {isAuthenticated, user} = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <div>Access denied. You do not have access</div>
    }

    return <>{children}</>;
}

export default ProtectedRoute;
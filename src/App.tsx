import {Route, Routes, useLocation} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthPage from "@/pages/AuthPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import CartPage from "@/pages/CartPage.tsx";
import SupportPage from "@/pages/SupportPage.tsx";
import StaffDashboard from "@/pages/StaffDashboard.tsx";
import AdminDashboard from "@/pages/AdminDashboard.tsx";
import ArtistDashboard from "@/pages/ArtistDashboard.tsx";
import { Navbar } from "./components/common/navbar.tsx";
import {PurchasedMusic} from "@/pages/PurhcasedMusicPage.tsx";
import ProtectedRoute from "./components/common/ProtectedRoutes.tsx";

function App() {
    const location = useLocation();

    const authRoutes = ["/auth" ];
    const hideNavbar = authRoutes.includes(location.pathname);
  return (
      <div className={"flex flex-col items-center justify-center min-h-screen"}>
        <div className={"sticky top-0 z-50 rounded-large"}>
            {!hideNavbar && <Navbar />}
        </div>
        <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<AuthPage />} path="/auth" />
            <Route element={<ProfilePage />} path="/profile" />
            <Route element={<CartPage />} path="/cart" />
            <Route element={<PurchasedMusic />} path="/my-music" />
            <Route
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ARTIST', 'STAFF', 'ADMIN']}>
                  <SupportPage />
                </ProtectedRoute>
              }
              path="/support"
            />
            <Route
              element={
                <ProtectedRoute allowedRoles={['ARTIST']}>
                  <ArtistDashboard />
                </ProtectedRoute>
              }
              path="/artist"
            />
            <Route
              element={
                <ProtectedRoute allowedRoles={['STAFF']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
              path="/staff"
            />
            <Route
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
              path="/admin"
            />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
  );
}

export default App;

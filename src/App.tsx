import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthPage from "@/pages/AuthPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import { Navbar } from "./components/common/navbar.tsx";

function App() {
  return (
      <div className={"flex flex-col items-center justify-center min-h-screen"}>
        <div className={"sticky top-0 z-50 rounded-large"}>
             <Navbar></Navbar>
        </div>
        <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<AuthPage />} path="/auth" />
            <Route element={<ProfilePage />} path="/profile" />
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

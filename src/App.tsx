import { Route, Routes } from "react-router-dom";

import AuthPage from "@/pages/AuthPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ProfilePage from "@/pages/ProfilePage.tsx";
import { Navbar } from "./components/navbar";

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
      </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import "@/context/AuthContext.tsx"
import {AuthProvider} from "@/context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <Provider>
                <main className="light h-full mr-6 light:bg-gradient-to-br light:from-primary-50 light:to-primary-100 dark:bg-gradient-to-br dark:from-primary-900 dark:to-primary-800">
                    <App />
                </main>
            </Provider>
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

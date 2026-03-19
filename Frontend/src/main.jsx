import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";   // ADDED: import AuthProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>                                      {/* ADDED: wraps entire app */}
        <App />                                           {/* so useAuth() works on  */}
      </AuthProvider>                                     {/* every page/component   */}
    </BrowserRouter>
  </React.StrictMode>,
);
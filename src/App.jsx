import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from 'sonner';
import useGoogleAuth from "./hooks/useGoogleAuth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AppContent = () => {
  const { user, token, login, logout } = useGoogleAuth();

  return (
    <div className="app-container">
      {!token ? (
        <Login login={login} />
      ) : (
        <Dashboard token={token} user={user} logout={logout} />
      )}
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Toaster position="top-right" richColors theme="dark" />
      <AppContent />
    </GoogleOAuthProvider>
  );
}

export default App;

import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [token, setToken] = useState(() => {
    // 1. Check for valid session on load
    const savedToken = localStorage.getItem("google_access_token");
    const expiry = localStorage.getItem("token_expiry");
    
    if (savedToken && expiry && Date.now() < parseInt(expiry)) {
      return savedToken;
    }
    return null;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Fetch user profile from Google
      import("axios").then((axios) => {
        axios.default.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          console.log("User Profile:", response.data);
          setUser(response.data);
        })
        .catch(error => console.error("Error fetching user:", error));
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const handleLoginSuccess = (tokenResponse) => {
    // 2. Handle Access Token Response
    console.log("Login Success:", tokenResponse);
    const accessToken = tokenResponse.access_token;
    const expiresIn = (tokenResponse.expires_in || 3600) * 1000; // usually 3600s
    
    setToken(accessToken);
    localStorage.setItem("google_access_token", accessToken);
    localStorage.setItem("token_expiry", Date.now() + expiresIn);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("token_expiry");
    // Optionally revoke token with googleLogout() from @react-oauth/google
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app-container">
        {!token ? (
          <Login 
            onSuccess={handleLoginSuccess} 
            onError={() => console.log("Login Failed")} 
          />
        ) : (
          <Dashboard token={token} user={user} logout={handleLogout} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

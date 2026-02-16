import { useState, useEffect } from 'react';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

const useGoogleAuth = () => {
    const [token, setToken] = useState(() => {
        // Initialize from localStorage
        const savedToken = localStorage.getItem("google_access_token");
        const expiry = localStorage.getItem("token_expiry");
        if (savedToken && expiry && Date.now() < parseInt(expiry)) {
            return savedToken;
        }
        return null;
    });

    const [user, setUser] = useState(null);

    // Google Login Hook
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            const accessToken = codeResponse.access_token;
            const expiresIn = (codeResponse.expires_in || 3600) * 1000;
            
            setToken(accessToken);
            localStorage.setItem("google_access_token", accessToken);
            localStorage.setItem("token_expiry", Date.now() + expiresIn);
        },
        onError: (error) => console.log('Login Failed:', error),
        scope: 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/userinfo.profile',
        flow: 'implicit'
    });

    // Fetch User Profile when token exists
    useEffect(() => {
        if (token) {
            axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error("Error fetching user profile:", error);
                logout(); // Logout if token is invalid
            });
        } else {
            setUser(null);
        }
    }, [token]);

    const logout = () => {
        googleLogout();
        setToken(null);
        setUser(null);
        localStorage.removeItem("google_access_token");
        localStorage.removeItem("token_expiry");
    };

    return { user, token, login, logout };
};

export default useGoogleAuth;

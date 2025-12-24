import { createContext, useContext, useState, useEffect } from "react";
import{ EncryptedAPI } from "./Helper/EncryptedAPI";

const AuthContext = createContext();
/* 
we cant redirect from here
*/
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("login_token"));
  const [isTokenSavedOnLogin, setIsTokenSavedOnLogin] = useState(false);

  const clearAuthState = () => {
    localStorage.removeItem("login_token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
    if (token) setToken(null);
    setIsTokenSavedOnLogin(false);
  };

  const getUser = async (login_token) => {
    if(!login_token){
      return clearAuthState();
    }
    const enc = new EncryptedAPI()
    try {
      const data = await enc.send(`${import.meta.env.VITE_APP_API_URL}/login/${login_token}`, {
        login_token:login_token
      });
      if (!data.success) throw new Error(data.message);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Auth error:", error.message);
      clearAuthState();
    }
  };

  // Monitor token changes, and run auth check again
useEffect(() => {
  if (token) {
    getUser(token);
  } else {
    // Only clear state if user/token exists
    if (user || loading) clearAuthState();
  }
}, [token]);


  // Function to update token in AuthContext and localStorage
  const setLoginToken = (newToken) => {
    localStorage.setItem("login_token", newToken);
    setToken(newToken);
    setIsTokenSavedOnLogin(true);
  };

  const logout = () => {
    clearAuthState();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, setLoginToken, token, isTokenSavedOnLogin, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

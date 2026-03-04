/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../lib/api.js";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


  
  const [authUser, setAuthUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);




  const login = async (state, credentials) => {
    
     try {
  
    const { data } = await api.post(`/api/auth/${state}`, credentials);


    if (data.success) {
      if (state !== "send-otp") {
        setAuthUser(data.user);
      }
      setIsNewUser(data.isNewUser);
      toast.success(data.message);
      setLoadingAuth(false);


      return data;
    }

        
     } catch (error) {
       const message =
      error.response?.data?.message || "Something went wrong";

        toast.error(message);
       return null;   // IMPORTANT
     }
  };



  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setAuthUser(null);
      toast.success("Logged out");
    } catch (error) {
      toast.error(error.message);
    }
  };




  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get(`/api/auth/me`, {});

        if (data.success) {
          setAuthUser(data.user);
        }
      } catch (err) {
        console.log(err.response?.data || err.message);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);




  const value = {
    login,
    isNewUser,
    authUser,
    logout,
    loadingAuth,
  };

  

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

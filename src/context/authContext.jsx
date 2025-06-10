
// AuthContext.js

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/config";
import { notifications } from "@mantine/notifications";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token");
    const role = sessionStorage.getItem("role")
      ? sessionStorage.getItem("role")
      : localStorage.getItem("role");
    return token ? { token, role } : null;
  });

  const navigate = useNavigate();

  const login = (token, role, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
    }
    setUser({ token, role });
  };

  const logout = async () => {
    const token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token");

    await axiosInstance
      .post(
        "/api/v1/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        sessionStorage.getItem("token")
          ? (sessionStorage.removeItem("token"),
            sessionStorage.removeItem("role"))
          : (localStorage.removeItem("token"), localStorage.removeItem("role"));
        setUser(null);
        navigate("/");
        notifications.show({
          title: "Logged out successfully.",
          message: "You are now logged out.",
          color: "green",
        })
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
        })
      });
  };

  const isSubscribed = async () => {
    const token = sessionStorage.getItem("token")
      ? sessionStorage.getItem("token")
      : localStorage.getItem("token");
    return await axiosInstance
      .get("/api/subscriptions/current", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isSubscribed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

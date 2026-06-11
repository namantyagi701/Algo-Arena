import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isSignedIn = !!user;

  // check auth on mount (restores session from httpOnly cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.checkAuth();
        setUser(userData);
      } catch {
        // not logged in — that's fine
        setUser(null);
      } finally {
        setIsLoaded(true);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authApi.login({ email, password });
      setUser(userData);
      toast.success("Logged in successfully!");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const userData = await authApi.signup({ name, email, password });
      setUser(userData);
      toast.success("Account created successfully!");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn, isLoaded, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

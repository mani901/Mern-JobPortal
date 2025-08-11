import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";

// Create the Context
const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true

  // Memoized function to check current auth status
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/v1/user/profile");

      if (response.data.success === true) {
        setUser(response.data.data);
        console.log(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - this function doesn't depend on any props/state

  // Check if user is already logged in when app starts (only once)
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]); // Only depend on the memoized function

  // Memoized login function
  const login = useCallback(
    async (email, password, role) => {
      try {
        setLoading(true);

        const response = await axiosInstance.post("/api/v1/user/login", {
          email,
          password,
          role: role,
        });
        console.log(response.data);
        if (response.data.success === true) {
          setUser(response.data.data);
          console.log("User logged in:", response.data.data);
          return {
            success: true,
            message: response.data.message,
          };
        } else {
          throw new Error(response.data.message || "Login failed");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || error.message || "Login failed";
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  ); // Only depend on navigate

  // Memoized logout function
  const logout = useCallback(async () => {
    try {
      // Call your logout endpoint
      await axiosInstance.get("/api/v1/user/logout");
      setUser(null);

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user data even if API call fails
      setUser(null);
      return { success: false, error: error.message };
    }
  }, []); // No dependencies

  // Memoized register function
  const register = useCallback(
    async (fullname, email, phoneNumber, password, role) => {
      try {
        setLoading(true);

        const response = await axiosInstance.post("/api/v1/user/register", {
          fullname,
          email,
          phoneNumber,
          password,
          role,
        });
        console.log(response.data);
        if (response.data.success === true) {
          setUser(response.data.data);
          return {
            success: true,
            message: response.data.message,
          };
        } else {
          throw new Error(response.data.message || "Registration failed");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Registration failed";
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Memoized isAuthenticated value
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Values to share across the app - properly memoized with all dependencies
  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      loading,
      isAuthenticated,
      checkAuthStatus,
    }),
    [user, login, logout, register, loading, isAuthenticated, checkAuthStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

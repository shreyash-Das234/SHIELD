import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/auth.service";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
    window.location.href = "/login";
  };

  return {
    user,
    isAuthenticated: !!user,
    logout,
  };
};

export default useAuth;
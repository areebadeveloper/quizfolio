// src/contexts/UserContext.tsx
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

interface UserContextProps {
  user: any | null;
  fetchUserDetails: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  fetchUserDetails: async () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const { token, isLoggedIn } = useContext(AuthContext);

  const fetchUserDetails = async () => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      console.log("Fetching user profile with token:", token);
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { 'x-auth-token': token },
      });
      console.log("User profile fetched successfully:", res.data);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error.response ? error.response.data : error.message);
    }
  };

  // Fetch user details if the user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [token, isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

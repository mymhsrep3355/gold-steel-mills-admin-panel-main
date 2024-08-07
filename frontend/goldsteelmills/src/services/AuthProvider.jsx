import { createContext, useState, useEffect } from "react";

// Create context
export const Auth = createContext({});

// AuthProvider component
export const AuthProvider = ({ children }) => {
    // State variables
    const [user, setUser] = useState(() => {
        // Initialize user from localStorage if available
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => {
        // Initialize token from localStorage if available
        return localStorage.getItem('token') || '';
    });

    // Effect to update localStorage whenever user or token changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Logout method
    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <Auth.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </Auth.Provider>
    );
};

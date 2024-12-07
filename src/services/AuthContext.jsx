import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.admin));
        
        setUser(data.admin);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setUser(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}
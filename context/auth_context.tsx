import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/constants/config';

export const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from AsyncStorage on app start
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    setAuth(JSON.parse(userData));
                }
            } catch (error: any) {
                console.log('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const handle_login = async (identifier: string, password: string) => {
        try {
            const response = await axios.post(`${config.URL}/auth/login`, {
                identifier: identifier,
                password: password
            });
            const user = response.data;
            console.log("Logged in user:", identifier, password, user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setAuth(user);
            return { 
                success: true, 
                data: user 
            };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed'
             };
        }
    };

    // handle register user
    const handle_register = async (name: string, identifier: string, password: string, role_id: string) => {
        try {
            console.log(name, identifier, password, role_id);
            const response = await axios.post(`${config.URL}/auth/register`, {
                name,
                identifier,
                password,
                role_id
            });
            
            const user = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setAuth(user);
            return { success: true, data: user };
        } catch (error: any) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    // logout user
    const handle_logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            setAuth(null);
        } catch (error: any) {
            console.log('Error logging out', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{
            auth,
            isLoading,
            handle_login,
            handle_register,
            handle_logout,
            // Compatibility with existing code
            user: auth?.user || auth,
            isAuthenticated: !!auth,
            login: handle_login,
            register: handle_register,
            logout: handle_logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider };
export default AuthProvider;
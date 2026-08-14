import { useState, useEffect } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

const normalizeUser = (rawUser) => {
    if (!rawUser) {
        return null;
    }

    const userId = rawUser._id || rawUser.id;

    return {
        ...rawUser,
        _id: userId,
        id: userId
    };
};
export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);

    const setUser = (nextUser) => {
        setUserState(normalizeUser(nextUser));
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await api.get('/auth/me');
                    if (res.data.success) {
                        setUser(res.data.data);
                    }
                } catch (err) {
                    console.error('Auth verification failed', err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await api.post('/auth/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

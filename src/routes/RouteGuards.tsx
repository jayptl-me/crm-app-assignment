import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const PublicRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

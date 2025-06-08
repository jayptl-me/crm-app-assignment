import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from './useRedux';
import authService from '../services/authService';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token is valid on component mount
    if (!authService.isAuthenticated() && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  return { user, isAuthenticated, isLoading, error };
};

export const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoading]);

  return { isAuthenticated, isLoading };
};

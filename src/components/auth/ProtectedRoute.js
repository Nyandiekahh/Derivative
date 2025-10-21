import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from '../../redux/slices/authSlice';
import Loader from '../shared/Loader';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, loading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !isAuthenticated) {
        try {
          await dispatch(initializeAuth(token)).unwrap();
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [token, isAuthenticated, dispatch]);

  if (isChecking || loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
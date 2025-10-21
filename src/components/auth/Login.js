import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { LogIn, TrendingUp } from 'lucide-react';
import { initializeAuth, setToken } from '../../redux/slices/authSlice';
import derivAPI from '../../services/derivAPI';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token1 = params.get('token1');
    const acct1 = params.get('acct1');

    if (token1 && acct1) {
      handleAuthCallback(token1, acct1);
    }
  }, [location]);

  const handleAuthCallback = async (token, account) => {
    try {
      dispatch(setToken(token));
      await dispatch(initializeAuth(token)).unwrap();
      toast.success('Login successful!');
      navigate('/trader');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleLogin = () => {
    const oauthUrl = derivAPI.getOAuthURL();
    window.location.href = oauthUrl;
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <TrendingUp size={48} className="login-icon" />
          <h1>Deriv Clone</h1>
          <p>Professional Trading Platform</p>
        </div>

        <div className="login-content">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to access your trading account
          </p>

          <motion.button
            className="login-button"
            onClick={handleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn size={20} />
            <span>Sign in with Deriv</span>
          </motion.button>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Real-time Charts</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <span>Bot Trading</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <span>Mobile Responsive</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>Powered by Deriv API</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
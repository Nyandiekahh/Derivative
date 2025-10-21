import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, LogOut, User } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, balance, currency } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isTraderPage = location.pathname === '/trader';
  const isBotPage = location.pathname === '/bot';

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <TrendingUp size={28} />
          <span>Deriv Clone</span>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-button ${isTraderPage ? 'active' : ''}`}
            onClick={() => navigate('/trader')}
          >
            Trader
          </button>
          <button
            className={`nav-button ${isBotPage ? 'active' : ''}`}
            onClick={() => navigate('/bot')}
          >
            Bot
          </button>
        </nav>
      </div>

      <div className="header-right">
        <div className="balance-display">
          <span className="balance-label">Balance:</span>
          <span className="balance-amount">
            {balance?.toFixed(2) || '0.00'} {currency}
          </span>
        </div>

        <div className="user-menu">
          <div className="user-info">
            <User size={20} />
            <span>{user?.email || user?.loginid || 'User'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
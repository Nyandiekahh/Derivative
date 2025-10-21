import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, LogOut, User, ChevronDown } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import derivAPI from '../../services/derivAPI';
import toast from 'react-hot-toast';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, balance, currency } = useSelector((state) => state.auth);
  const [accounts, setAccounts] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    // Get account list from user data
    if (user && user.account_list) {
      setAccounts(user.account_list);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleAccountSwitch = (account) => {
    toast.info(`Switching to ${account.currency} account...`);
    setShowAccountMenu(false);
    // In production, you would re-authorize with the new account's token
  };

  const isTraderPage = location.pathname === '/trader';
  const isBotPage = location.pathname === '/bot';

  const currentAccount = user?.loginid || 'Account';
  const accountType = user?.is_virtual ? 'Demo' : 'Real';

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
        {/* Account Selector */}
        {accounts.length > 0 && (
          <div className="account-selector">
            <button 
              className="account-button"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
              <div className="account-info">
                <span className="account-type">{accountType}</span>
                <span className="account-id">{currentAccount}</span>
              </div>
              <ChevronDown size={16} />
            </button>
            
            {showAccountMenu && (
              <div className="account-menu">
                {accounts.map((account) => (
                  <button
                    key={account.loginid}
                    className={`account-menu-item ${account.loginid === currentAccount ? 'active' : ''}`}
                    onClick={() => handleAccountSwitch(account)}
                  >
                    <div className="account-menu-info">
                      <span className="account-menu-id">{account.loginid}</span>
                      <span className="account-menu-type">
                        {account.is_virtual ? 'Demo' : 'Real'} • {account.currency}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Balance Display */}
        <div className="balance-display">
          <span className="balance-label">Balance:</span>
          <span className="balance-amount">
            {balance?.toFixed(2) || '0.00'} {currency}
          </span>
        </div>

        {/* User Menu */}
        <div className="user-menu">
          <div className="user-info">
            <User size={20} />
            <span>{user?.email || user?.loginid || 'User'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
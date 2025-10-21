import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import LoginPage from './pages/LoginPage';
import TraderPage from './pages/TraderPage';
import BotPage from './pages/BotPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import derivAPI from './services/derivAPI';
import './App.css';

function App() {
  useEffect(() => {
    derivAPI.initialize().catch(console.error);
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/callback" element={<LoginPage />} />
              <Route
                path="/trader"
                element={
                  <ProtectedRoute>
                    <TraderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bot"
                element={
                  <ProtectedRoute>
                    <BotPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/trader" replace />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
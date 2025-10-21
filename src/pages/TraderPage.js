import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Chart from '../components/trader/Chart';
import TradePanel from '../components/trader/TradePanel';
import TradeHistory from '../components/trader/TradeHistory';
import Portfolio from '../components/trader/Portfolio';
import TradeAnimation from '../components/trader/TradeAnimation';
import { fetchActiveSymbols } from '../redux/slices/marketSlice';
import { fetchPortfolio } from '../redux/slices/tradeSlice';
import { setBalance } from '../redux/slices/authSlice';
import derivAPI from '../services/derivAPI';
import './TraderPage.css';

const TraderPage = () => {
  const dispatch = useDispatch();
  const [showHistory, setShowHistory] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const tradeAnimation = useSelector((state) => state.trade.tradeAnimation);

  useEffect(() => {
    dispatch(fetchActiveSymbols());
    dispatch(fetchPortfolio());

    const unsubscribeBalance = derivAPI.subscribeBalance((data) => {
      if (data.balance) {
        dispatch(setBalance({
          balance: data.balance.balance,
          currency: data.balance.currency
        }));
      }
    });

    return () => {
      unsubscribeBalance();
    };
  }, [dispatch]);

  return (
    <div className="trader-page">
      <Header />
      <div className="trader-content">
        <Sidebar />
        <main className="trader-main">
          <div className="trader-grid">
            <div className="chart-section">
              <Chart />
            </div>
            <div className="trade-panel-section">
              <TradePanel />
            </div>
          </div>

          <div className="trader-tabs">
            <button
              className={`tab-button ${showHistory ? 'active' : ''}`}
              onClick={() => {
                setShowHistory(!showHistory);
                setShowPortfolio(false);
              }}
            >
              Trade History
            </button>
            <button
              className={`tab-button ${showPortfolio ? 'active' : ''}`}
              onClick={() => {
                setShowPortfolio(!showPortfolio);
                setShowHistory(false);
              }}
            >
              Portfolio
            </button>
          </div>

          {showHistory && (
            <div className="trader-section fade-in">
              <TradeHistory />
            </div>
          )}

          {showPortfolio && (
            <div className="trader-section fade-in">
              <Portfolio />
            </div>
          )}
        </main>
      </div>

      {tradeAnimation.show && <TradeAnimation />}
    </div>
  );
};

export default TraderPage;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { fetchTradeHistory } from '../../redux/slices/tradeSlice';
import './TradeHistory.css';

const TradeHistory = () => {
  const dispatch = useDispatch();
  const { tradeHistory } = useSelector((state) => state.trade);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    const getDateRange = () => {
      const today = Math.floor(Date.now() / 1000);
      let fromDate = today;

      switch (dateRange) {
        case '1day':
          fromDate = today - 86400;
          break;
        case '7days':
          fromDate = today - 604800;
          break;
        case '30days':
          fromDate = today - 2592000;
          break;
        default:
          fromDate = today - 604800;
      }

      return { from: fromDate, to: today };
    };

    const range = getDateRange();
    dispatch(fetchTradeHistory({ dateFrom: range.from, dateTo: range.to }));
  }, [dateRange, dispatch]);

  const totalProfit = tradeHistory.reduce((sum, trade) => sum + parseFloat(trade.sell_price - trade.buy_price || 0), 0);
  const winCount = tradeHistory.filter((trade) => parseFloat(trade.sell_price - trade.buy_price || 0) > 0).length;

  if (!tradeHistory || tradeHistory.length === 0) {
    return (
      <div className="history-empty">
        <History size={48} className="empty-icon" />
        <h3>No Trade History</h3>
        <p>Your completed trades will appear here</p>
      </div>
    );
  }

  return (
    <div className="trade-history-container">
      <div className="history-header">
        <h3>Trade History</h3>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="date-range-select"
        >
          <option value="1day">Last 24 Hours</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value">{tradeHistory.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{tradeHistory.length > 0 ? ((winCount / tradeHistory.length) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total P/L</div>
          <div className={`stat-value ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} USD
          </div>
        </div>
      </div>

      <div className="history-list">
        {tradeHistory.map((trade, index) => {
          const profit = parseFloat(trade.sell_price - trade.buy_price || 0);
          const isProfit = profit > 0;

          return (
            <div key={index} className="history-item">
              <div className="history-item-left">
                <div className={`trade-indicator ${isProfit ? 'profit' : 'loss'}`}>
                  {isProfit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div className="trade-info">
                  <div className="trade-symbol">{trade.symbol || 'N/A'}</div>
                  <div className="trade-type">{trade.contract_type || 'Unknown'}</div>
                </div>
              </div>

              <div className="history-item-center">
                <div className="trade-detail">
                  <span className="detail-label">Buy:</span>
                  <span className="detail-value">{parseFloat(trade.buy_price || 0).toFixed(2)}</span>
                </div>
                <div className="trade-detail">
                  <span className="detail-label">Sell:</span>
                  <span className="detail-value">{parseFloat(trade.sell_price || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="history-item-right">
                <div className={`trade-profit ${isProfit ? 'positive' : 'negative'}`}>
                  {isProfit ? '+' : ''}{profit.toFixed(2)} USD
                </div>
                <div className="trade-date">
                  <Calendar size={12} />
                  {new Date(trade.purchase_time * 1000).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeHistory;
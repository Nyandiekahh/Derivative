import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchPortfolio } from '../../redux/slices/tradeSlice';
import './Portfolio.css';

const Portfolio = () => {
  const dispatch = useDispatch();
  const { portfolio } = useSelector((state) => state.trade);

  useEffect(() => {
    dispatch(fetchPortfolio());
    const interval = setInterval(() => {
      dispatch(fetchPortfolio());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="portfolio-empty">
        <Briefcase size={48} className="empty-icon" />
        <h3>No Active Positions</h3>
        <p>Your active trades will appear here</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-header">
        <h3>Active Positions</h3>
        <span className="portfolio-count">{portfolio.length} open</span>
      </div>

      <div className="portfolio-list">
        {portfolio.map((contract) => {
          const isProfit = parseFloat(contract.profit || 0) > 0;
          
          return (
            <div key={contract.contract_id} className="portfolio-item">
              <div className="portfolio-item-header">
                <div className="contract-symbol">
                  {contract.symbol}
                </div>
                <div className={`contract-profit ${isProfit ? 'positive' : 'negative'}`}>
                  {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{parseFloat(contract.profit || 0).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="portfolio-item-body">
                <div className="contract-detail">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{contract.contract_type}</span>
                </div>
                <div className="contract-detail">
                  <span className="detail-label">Buy Price:</span>
                  <span className="detail-value">{parseFloat(contract.buy_price).toFixed(2)}</span>
                </div>
                <div className="contract-detail">
                  <span className="detail-label">Current Price:</span>
                  <span className="detail-value">{parseFloat(contract.bid_price || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="portfolio-item-footer">
                <div className="contract-time">
                  Purchase: {new Date(contract.purchase_time * 1000).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
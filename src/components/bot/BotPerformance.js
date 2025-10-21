import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import './BotPerformance.css';

const BotPerformance = () => {
  const { botPerformance, tradeLog } = useSelector((state) => state.bot);

  const winRate = botPerformance.totalRuns > 0
    ? ((botPerformance.successfulTrades / (botPerformance.successfulTrades + botPerformance.failedTrades)) * 100).toFixed(1)
    : 0;

  const netProfit = botPerformance.totalProfit - botPerformance.totalLoss;

  return (
    <div className="bot-performance">
      <div className="performance-header">
        <h3>Performance</h3>
        <Activity size={20} className="header-icon" />
      </div>

      <div className="performance-stats">
        <div className="stat-item">
          <div className="stat-label">Total Runs</div>
          <div className="stat-value">{botPerformance.totalRuns}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{winRate}%</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <TrendingUp size={14} />
            Wins
          </div>
          <div className="stat-value success">{botPerformance.successfulTrades}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <TrendingDown size={14} />
            Losses
          </div>
          <div className="stat-value danger">{botPerformance.failedTrades}</div>
        </div>

        <div className="stat-item full-width">
          <div className="stat-label">Net Profit/Loss</div>
          <div className={`stat-value large ${netProfit >= 0 ? 'success' : 'danger'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(2)} USD
          </div>
        </div>
      </div>

      <div className="trade-log">
        <h4>Recent Trades</h4>
        {tradeLog.length === 0 ? (
          <div className="log-empty">No trades yet</div>
        ) : (
          <div className="log-list">
            {tradeLog.slice(0, 5).map((log, index) => (
              <div key={index} className={`log-item ${log.result}`}>
                <div className="log-time">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="log-details">
                  <span className="log-symbol">{log.symbol}</span>
                  <span className={`log-profit ${log.result}`}>
                    {log.result === 'win' ? '+' : '-'}{Math.abs(log.profit || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BotPerformance;
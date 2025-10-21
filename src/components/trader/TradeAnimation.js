import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, X } from 'lucide-react';
import { hideTradeAnimation } from '../../redux/slices/tradeSlice';
import './TradeAnimation.css';

const TradeAnimation = () => {
  const dispatch = useDispatch();
  const { tradeAnimation } = useSelector((state) => state.trade);
  const [countdown, setCountdown] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (tradeAnimation.show && tradeAnimation.data) {
      const contract = tradeAnimation.data;
      
      // Simulate countdown based on duration
      if (contract.contract_type && tradeAnimation.type === 'pending') {
        // This is a simplified version - in production, track actual contract status
        const duration = 5; // seconds for demo
        let timeLeft = duration;
        
        const timer = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            // Simulate random win/loss for demo
            const isWin = Math.random() > 0.5;
            setResult(isWin ? 'win' : 'loss');
            
            setTimeout(() => {
              dispatch(hideTradeAnimation());
              setCountdown(null);
              setResult(null);
            }, 3000);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }
  }, [tradeAnimation, dispatch]);

  const handleClose = () => {
    dispatch(hideTradeAnimation());
    setCountdown(null);
    setResult(null);
  };

  return (
    <AnimatePresence>
      {tradeAnimation.show && (
        <motion.div
          className="trade-animation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="trade-animation-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <button className="close-button" onClick={handleClose}>
              <X size={20} />
            </button>

            {countdown !== null && result === null && (
              <div className="animation-content">
                <motion.div
                  className="countdown-circle"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Clock size={48} />
                </motion.div>
                <h2 className="animation-title">Trade in Progress</h2>
                <div className="countdown-number">{countdown}s</div>
                <p className="animation-subtitle">Waiting for result...</p>
              </div>
            )}

            {result === 'win' && (
              <motion.div
                className="animation-content win"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <motion.div
                  className="result-icon win"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingUp size={64} />
                </motion.div>
                <h2 className="animation-title">You Won!</h2>
                <div className="result-amount">
                  +{((tradeAnimation.data?.payout || 0) - (tradeAnimation.data?.buy_price || 0)).toFixed(2)} USD
                </div>
                <p className="animation-subtitle">Congratulations on your winning trade!</p>
              </motion.div>
            )}

            {result === 'loss' && (
              <motion.div
                className="animation-content loss"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <motion.div
                  className="result-icon loss"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingDown size={64} />
                </motion.div>
                <h2 className="animation-title">Trade Lost</h2>
                <div className="result-amount loss">
                  -{(tradeAnimation.data?.buy_price || 0).toFixed(2)} USD
                </div>
                <p className="animation-subtitle">Better luck next time!</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TradeAnimation;
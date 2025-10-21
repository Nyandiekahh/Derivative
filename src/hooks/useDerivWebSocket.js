import { useEffect, useCallback } from 'react';
import derivAPI from '../services/derivAPI';

const useDerivWebSocket = () => {
  useEffect(() => {
    // Initialize WebSocket connection
    derivAPI.initialize().catch(console.error);

    return () => {
      // Cleanup on unmount
      derivAPI.disconnect();
    };
  }, []);

  const subscribeTicks = useCallback((symbol, callback) => {
    return derivAPI.subscribeTicks(symbol, callback);
  }, []);

  const subscribeCandles = useCallback((symbol, granularity, callback) => {
    return derivAPI.subscribeCandles(symbol, granularity, callback);
  }, []);

  const subscribeBalance = useCallback((callback) => {
    return derivAPI.subscribeBalance(callback);
  }, []);

  const subscribeProposal = useCallback((proposal, callback) => {
    return derivAPI.subscribeProposal(proposal, callback);
  }, []);

  return {
    subscribeTicks,
    subscribeCandles,
    subscribeBalance,
    subscribeProposal,
  };
};

export default useDerivWebSocket;
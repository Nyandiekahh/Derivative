import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowUp, ArrowDown } from 'lucide-react';
import {
  setContractType,
  setTradeAmount,
  setDuration,
  setDurationType,
  placeTrade,
  setCurrentProposal,
  showTradeAnimation,
} from '../../redux/slices/tradeSlice';
import { CONTRACT_TYPES, DURATION_TYPES } from '../../constants/tradeTypes';
import derivAPI from '../../services/derivAPI';
import toast from 'react-hot-toast';
import ContractTypes from './ContractTypes';
import './TradePanel.css';

const TradePanel = () => {
  const dispatch = useDispatch();
  const {
    selectedSymbol,
    selectedContractType,
    tradeAmount,
    duration,
    durationType,
    currentProposal,
    loading,
  } = useSelector((state) => state.trade);

  const [prediction, setPrediction] = useState(5);

  useEffect(() => {
    if (!selectedSymbol || !selectedContractType) return;

    const proposalParams = {
      contract_type: selectedContractType,
      symbol: selectedSymbol,
      duration: duration,
      duration_unit: DURATION_TYPES[durationType]?.id || 't',
      amount: tradeAmount,
      basis: 'stake',
      currency: 'USD',
    };

    // Add barrier for certain contract types
    if (selectedContractType === 'DIGITMATCH' || selectedContractType === 'DIGITDIFF') {
      proposalParams.barrier = prediction;
    }

    const unsubscribe = derivAPI.subscribeProposal(proposalParams, (data) => {
      if (data.proposal) {
        dispatch(setCurrentProposal(data.proposal));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedSymbol, selectedContractType, tradeAmount, duration, durationType, prediction, dispatch]);

  const handleTrade = async () => {
    if (!currentProposal || !currentProposal.id) {
      toast.error('Please wait for proposal to load');
      return;
    }

    try {
      const params = {
        proposal_id: currentProposal.id,
        amount: tradeAmount,
      };

      const result = await dispatch(placeTrade(params)).unwrap();

      dispatch(
        showTradeAnimation({
          type: 'pending',
          data: result,
        })
      );

      toast.success('Trade placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place trade');
    }
  };

  return (
    <div className="trade-panel">
      <div className="trade-panel-header">
        <h3>Trade Parameters</h3>
      </div>

      <div className="trade-panel-content">
        <ContractTypes />

        <div className="form-group">
          <label>Stake Amount (USD)</label>
          <input
            type="number"
            value={tradeAmount}
            onChange={(e) => dispatch(setTradeAmount(parseFloat(e.target.value)))}
            min="1"
            step="1"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Duration</label>
          <div className="duration-group">
            <input
              type="number"
              value={duration}
              onChange={(e) => dispatch(setDuration(parseInt(e.target.value)))}
              min={DURATION_TYPES[durationType]?.min || 1}
              max={DURATION_TYPES[durationType]?.max || 10}
              className="input-field"
            />
            <select
              value={durationType}
              onChange={(e) => dispatch(setDurationType(e.target.value))}
              className="select-field"
            >
              {Object.keys(DURATION_TYPES).map((key) => (
                <option key={key} value={key}>
                  {DURATION_TYPES[key].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(selectedContractType === 'DIGITMATCH' || selectedContractType === 'DIGITDIFF') && (
          <div className="form-group">
            <label>Prediction (Last Digit)</label>
            <input
              type="number"
              value={prediction}
              onChange={(e) => setPrediction(parseInt(e.target.value))}
              min="0"
              max="9"
              className="input-field"
            />
          </div>
        )}

        {currentProposal && (
          <div className="proposal-info">
            <div className="proposal-row">
              <span>Payout:</span>
              <span className="proposal-value">
                {currentProposal.payout?.toFixed(2) || '0.00'} USD
              </span>
            </div>
            <div className="proposal-row">
              <span>Potential Profit:</span>
              <span className="proposal-profit">
                {((currentProposal.payout || 0) - tradeAmount).toFixed(2)} USD
              </span>
            </div>
          </div>
        )}

        <button
          className="trade-button"
          onClick={handleTrade}
          disabled={loading || !currentProposal}
        >
          {loading ? 'Placing Trade...' : 'Place Trade'}
        </button>
      </div>
    </div>
  );
};

export default TradePanel;
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { startBot, stopBot, pauseBot, resumeBot, resetBotPerformance } from '../../redux/slices/botSlice';
import toast from 'react-hot-toast';
import './BotControls.css';

const BotControls = () => {
  const dispatch = useDispatch();
  const { isRunning, isPaused, currentStrategy } = useSelector((state) => state.bot);

  const handleStart = () => {
    if (!currentStrategy || currentStrategy.trim() === '') {
      toast.error('Please create a strategy first');
      return;
    }
    dispatch(startBot());
    toast.success('Bot started');
  };

  const handlePause = () => {
    if (isPaused) {
      dispatch(resumeBot());
      toast.success('Bot resumed');
    } else {
      dispatch(pauseBot());
      toast.success('Bot paused');
    }
  };

  const handleStop = () => {
    dispatch(stopBot());
    toast.success('Bot stopped');
  };

  const handleReset = () => {
    dispatch(resetBotPerformance());
    toast.success('Performance stats reset');
  };

  return (
    <div className="bot-controls">
      <div className="controls-header">
        <h3>Bot Controls</h3>
        <div className={`status-indicator ${isRunning ? 'running' : 'stopped'}`}>
          {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Stopped'}
        </div>
      </div>

      <div className="controls-buttons">
        <button
          className="control-button start"
          onClick={handleStart}
          disabled={isRunning}
        >
          <Play size={20} />
          <span>Start</span>
        </button>

        <button
          className="control-button pause"
          onClick={handlePause}
          disabled={!isRunning}
        >
          <Pause size={20} />
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          className="control-button stop"
          onClick={handleStop}
          disabled={!isRunning}
        >
          <Square size={20} />
          <span>Stop</span>
        </button>

        <button
          className="control-button reset"
          onClick={handleReset}
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default BotControls;
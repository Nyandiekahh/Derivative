import { createSlice } from '@reduxjs/toolkit';

const botSlice = createSlice({
  name: 'bot',
  initialState: {
    isRunning: false,
    isPaused: false,
    workspace: null,
    currentStrategy: null,
    botPerformance: {
      totalRuns: 0,
      successfulTrades: 0,
      failedTrades: 0,
      totalProfit: 0,
      totalLoss: 0,
      startTime: null,
      endTime: null,
    },
    tradeLog: [],
    selectedTemplate: null,
    loading: false,
    error: null,
  },
  reducers: {
    startBot: (state) => {
      state.isRunning = true;
      state.isPaused = false;
      state.botPerformance.startTime = new Date().toISOString();
      state.botPerformance.totalRuns += 1;
    },
    stopBot: (state) => {
      state.isRunning = false;
      state.isPaused = false;
      state.botPerformance.endTime = new Date().toISOString();
    },
    pauseBot: (state) => {
      state.isPaused = true;
    },
    resumeBot: (state) => {
      state.isPaused = false;
    },
    setWorkspace: (state, action) => {
      state.workspace = action.payload;
    },
    setCurrentStrategy: (state, action) => {
      state.currentStrategy = action.payload;
    },
    addTradeLog: (state, action) => {
      state.tradeLog.unshift(action.payload);
      if (state.tradeLog.length > 100) {
        state.tradeLog.pop();
      }
      
      if (action.payload.result === 'win') {
        state.botPerformance.successfulTrades += 1;
        state.botPerformance.totalProfit += action.payload.profit || 0;
      } else if (action.payload.result === 'loss') {
        state.botPerformance.failedTrades += 1;
        state.botPerformance.totalLoss += Math.abs(action.payload.profit || 0);
      }
    },
    clearTradeLog: (state) => {
      state.tradeLog = [];
    },
    resetBotPerformance: (state) => {
      state.botPerformance = {
        totalRuns: 0,
        successfulTrades: 0,
        failedTrades: 0,
        totalProfit: 0,
        totalLoss: 0,
        startTime: null,
        endTime: null,
      };
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setBotError: (state, action) => {
      state.error = action.payload;
      state.isRunning = false;
    },
  },
});

export const {
  startBot,
  stopBot,
  pauseBot,
  resumeBot,
  setWorkspace,
  setCurrentStrategy,
  addTradeLog,
  clearTradeLog,
  resetBotPerformance,
  setSelectedTemplate,
  setBotError,
} = botSlice.actions;

export default botSlice.reducer;
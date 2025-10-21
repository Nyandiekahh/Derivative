// App-wide constants

// API Configuration
export const API_CONFIG = {
  WEBSOCKET_URL: process.env.REACT_APP_DERIV_WEBSOCKET_URL,
  APP_ID: process.env.REACT_APP_DERIV_APP_ID,
  OAUTH_URL: process.env.REACT_APP_DERIV_OAUTH_URL,
  CALLBACK_URL: process.env.REACT_APP_CALLBACK_URL,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'derivToken',
  USER_PREFERENCES: 'userPreferences',
  BOT_STRATEGIES: 'botStrategies',
};

// WebSocket Message Types
export const WS_MSG_TYPES = {
  AUTHORIZE: 'authorize',
  BALANCE: 'balance',
  TICKS: 'tick',
  CANDLES: 'candles',
  PROPOSAL: 'proposal',
  BUY: 'buy',
  SELL: 'sell',
  PORTFOLIO: 'portfolio',
  PROFIT_TABLE: 'profit_table',
  ACTIVE_SYMBOLS: 'active_symbols',
};

// Default Values
export const DEFAULTS = {
  TRADE_AMOUNT: 10,
  DURATION: 5,
  DURATION_TYPE: 'tick',
  CHART_TYPE: 'line',
  SYMBOL: 'R_10',
};

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    UP: '#4ade80',
    DOWN: '#ff444f',
    LINE: '#ff444f',
    BACKGROUND: '#1a1a1a',
    GRID: '#2a2a2a',
    TEXT: '#999',
  },
  MAX_DATA_POINTS: 1000,
  UPDATE_INTERVAL: 1000, // milliseconds
};

// Animation Durations
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Trade Status
export const TRADE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  WON: 'won',
  LOST: 'lost',
};

// Bot Status
export const BOT_STATUS = {
  STOPPED: 'stopped',
  RUNNING: 'running',
  PAUSED: 'paused',
};
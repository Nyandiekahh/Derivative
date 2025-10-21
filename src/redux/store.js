import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tradeReducer from './slices/tradeSlice';
import botReducer from './slices/botSlice';
import marketReducer from './slices/marketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trade: tradeReducer,
    bot: botReducer,
    market: marketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['trade/setChartRef'],
        ignoredPaths: ['trade.chartRef'],
      },
    }),
});

export default store;
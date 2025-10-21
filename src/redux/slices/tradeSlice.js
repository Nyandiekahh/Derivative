import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import derivAPI from '../../services/derivAPI';

export const placeTrade = createAsyncThunk(
  'trade/placeTrade',
  async (tradeParams) => {
    const result = await derivAPI.buyContract(tradeParams);
    return result;
  }
);

export const fetchPortfolio = createAsyncThunk(
  'trade/fetchPortfolio',
  async () => {
    const portfolio = await derivAPI.getPortfolio();
    return portfolio;
  }
);

export const fetchTradeHistory = createAsyncThunk(
  'trade/fetchHistory',
  async ({ dateFrom, dateTo }) => {
    const history = await derivAPI.getProfitTable(dateFrom, dateTo);
    return history;
  }
);

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    selectedSymbol: 'R_10',
    selectedContractType: 'MULTUP',
    tradeAmount: 10,
    duration: 5,
    durationType: 'tick',
    tickData: [],
    candleData: [],
    chartType: 'line',
    chartRef: null,
    portfolio: [],
    tradeHistory: [],
    currentProposal: null,
    activeTrade: null,
    tradeAnimation: {
      show: false,
      type: null,
      data: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    setContractType: (state, action) => {
      state.selectedContractType = action.payload;
    },
    setTradeAmount: (state, action) => {
      state.tradeAmount = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setDurationType: (state, action) => {
      state.durationType = action.payload;
    },
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setChartRef: (state, action) => {
      state.chartRef = action.payload;
    },
    addTickData: (state, action) => {
      state.tickData.push(action.payload);
      if (state.tickData.length > 1000) {
        state.tickData.shift();
      }
    },
    addCandleData: (state, action) => {
      const lastCandle = state.candleData[state.candleData.length - 1];
      if (lastCandle && lastCandle.time === action.payload.time) {
        state.candleData[state.candleData.length - 1] = action.payload;
      } else {
        state.candleData.push(action.payload);
      }
      if (state.candleData.length > 1000) {
        state.candleData.shift();
      }
    },
    setCurrentProposal: (state, action) => {
      state.currentProposal = action.payload;
    },
    setActiveTrade: (state, action) => {
      state.activeTrade = action.payload;
    },
    showTradeAnimation: (state, action) => {
      state.tradeAnimation = {
        show: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    hideTradeAnimation: (state) => {
      state.tradeAnimation = {
        show: false,
        type: null,
        data: null,
      };
    },
    clearTickData: (state) => {
      state.tickData = [];
    },
    clearCandleData: (state) => {
      state.candleData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeTrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTrade = action.payload;
      })
      .addCase(placeTrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolio = action.payload.contracts || [];
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.tradeHistory = action.payload.transactions || [];
      });
  },
});

export const {
  setSelectedSymbol,
  setContractType,
  setTradeAmount,
  setDuration,
  setDurationType,
  setChartType,
  setChartRef,
  addTickData,
  addCandleData,
  setCurrentProposal,
  setActiveTrade,
  showTradeAnimation,
  hideTradeAnimation,
  clearTickData,
  clearCandleData,
} = tradeSlice.actions;

export default tradeSlice.reducer;
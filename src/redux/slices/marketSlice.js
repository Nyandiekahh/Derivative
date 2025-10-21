import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import derivAPI from '../../services/derivAPI';

export const fetchActiveSymbols = createAsyncThunk(
  'market/fetchActiveSymbols',
  async () => {
    const symbols = await derivAPI.getActiveSymbols();
    return symbols;
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: {
    activeSymbols: [],
    symbolsByMarket: {},
    loading: false,
    error: null,
  },
  reducers: {
    setActiveSymbols: (state, action) => {
      state.activeSymbols = action.payload;
      
      const grouped = {};
      action.payload.forEach(symbol => {
        const market = symbol.market || 'other';
        if (!grouped[market]) {
          grouped[market] = [];
        }
        grouped[market].push(symbol);
      });
      state.symbolsByMarket = grouped;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSymbols.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSymbols.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSymbols = action.payload;
        
        const grouped = {};
        action.payload.forEach(symbol => {
          const market = symbol.market || 'other';
          if (!grouped[market]) {
            grouped[market] = [];
          }
          grouped[market].push(symbol);
        });
        state.symbolsByMarket = grouped;
      })
      .addCase(fetchActiveSymbols.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setActiveSymbols } = marketSlice.actions;
export default marketSlice.reducer;
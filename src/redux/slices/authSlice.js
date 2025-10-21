import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import derivAPI from '../../services/derivAPI';

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (token) => {
    const userData = await derivAPI.authorize(token);
    return { token, userData };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    token: localStorage.getItem('derivToken') || null,
    user: null,
    balance: 0,
    currency: 'USD',
    loading: false,
    error: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('derivToken', action.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.balance = 0;
      localStorage.removeItem('derivToken');
      derivAPI.disconnect();
    },
    setBalance: (state, action) => {
      state.balance = action.payload.balance;
      state.currency = action.payload.currency;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.userData;
        state.balance = action.payload.userData.balance || 0;
        state.currency = action.payload.userData.currency || 'USD';
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
      });
  },
});

export const { setToken, logout, setBalance } = authSlice.actions;
export default authSlice.reducer;
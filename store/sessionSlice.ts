import type { SessionState, UserInfo } from '@/constants/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import type { RootState } from './index';

const initialState: SessionState = {
  token: null,
  user: null,
  lastActiveAt: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token?: string | null; user?: UserInfo | null } | undefined>,
    ) => {
      const { token, user } = action.payload || {};
      state.token = token ?? null;
      state.user = user ?? null;
      state.lastActiveAt = Date.now();
    },
    setUser: (state, action: PayloadAction<UserInfo | null | undefined>) => {
      state.user = action.payload ?? null;
      if (action.payload) {
        state.lastActiveAt = Date.now();
      }
    },
    setLastActiveNow: (state) => {
      state.lastActiveAt = Date.now();
    },
    clearSession: () => ({ ...initialState }),
    unauthorized: () => ({ ...initialState }),
  },
});

export const { setCredentials, setUser, setLastActiveNow, clearSession, unauthorized } =
  sessionSlice.actions;

export const selectToken = (state: RootState) => state.session.token;

export const useSession = () => useSelector((s: RootState) => s.session);

export default sessionSlice.reducer;

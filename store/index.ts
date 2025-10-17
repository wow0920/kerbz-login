import { configureStore, type UnknownAction } from '@reduxjs/toolkit';
import sessionReducer, { clearSession, unauthorized } from './sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const setupUnauthorizedHandler = (store: AppStore) => ({
  onUnauthorized: () => store.dispatch(unauthorized() as UnknownAction),
  onLogout: () => store.dispatch(clearSession() as UnknownAction),
});

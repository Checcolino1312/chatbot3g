import { configureStore } from '@reduxjs/toolkit';
import { rasaApi } from '../services/rasaApi'; // controlla che esista!


export const store = configureStore({
  reducer: {
    [rasaApi.reducerPath]: rasaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rasaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import tablesReducer from '../features/table/tablesSlice';

export const store = configureStore({
  reducer: {
    tables: tablesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

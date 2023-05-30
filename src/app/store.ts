import { configureStore } from '@reduxjs/toolkit';
import tablesReducer from '../features/table/tablesSlice';
import chartsReducer from '../features/chart/chartsSlice';

export const store = configureStore({
  reducer: {
    tables: tablesReducer,
    charts: chartsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DB_NAMES } from '../../constants';

const initialState: TableState = {
  selectedTableNames: [DB_NAMES[0]],
  selectedTables: [],
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setSelectedTables(state, action: PayloadAction<{ newTables: ITableRow[][] }>) {
      state.selectedTables = action.payload.newTables;
    },
    setSelectedTableNames(state, action: PayloadAction<{ newNames: string[] }>) {
      state.selectedTableNames = action.payload.newNames;
    },
  },
});

export const { setSelectedTables, setSelectedTableNames } = tablesSlice.actions;
export default tablesSlice.reducer;

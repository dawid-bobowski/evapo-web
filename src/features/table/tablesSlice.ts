import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DB_NAMES } from '../../constants';

const initialState: TableState = {
  currentTable1: [],
  currentTable2: [],
  selectedTableName1: DB_NAMES[0],
  selectedTableName2: DB_NAMES[1],
};

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTable1(state, action: PayloadAction<{ newTable: ITableRow[] }>) {
      state.currentTable1 = action.payload.newTable;
    },
    setSelectedTableName1(state, action: PayloadAction<{ newSelectedTableName: string }>) {
      state.selectedTableName1 = action.payload.newSelectedTableName;
    },
    setTable2(state, action: PayloadAction<{ newTable: ITableRow[] }>) {
      state.currentTable2 = action.payload.newTable;
    },
    setSelectedTableName2(state, action: PayloadAction<{ newSelectedTableName: string }>) {
      state.selectedTableName2 = action.payload.newSelectedTableName;
    },
  },
});

export const { setTable1, setTable2, setSelectedTableName1, setSelectedTableName2 } = tablesSlice.actions;
export default tablesSlice.reducer;

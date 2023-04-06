import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DB_NAMES } from '../../constants';

const initialState: TableState = {
  currentTable: [],
  selectedTableName: DB_NAMES[0],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<{ newTable: ITableRow[] }>) {
      state.currentTable = action.payload.newTable;
    },
    setSelectedTableName(state, action: PayloadAction<{ newSelectedTableName: string }>) {
      state.selectedTableName = action.payload.newSelectedTableName;
    },
  },
});

export const { setTable, setSelectedTableName } = tableSlice.actions;
export default tableSlice.reducer;

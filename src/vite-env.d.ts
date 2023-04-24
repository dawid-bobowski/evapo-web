/// <reference types="vite/client" />

interface ITableRow {
  date: string;
  T?: number;
  Rs?: number;
  RH?: number;
  V?: number;
  P?: number;
  RH13?: number;
  RHmin?: number;
  Tmax?: number;
  Tmin?: number;
  Ra?: number;
  Emax?: number;
  E?: number;
}

interface IDataRow {
  Dzien: string;
  T: string;
  Rs: string;
  RH: string;
  V: string;
  P: string;
  RH13: string;
  RHmin: string;
  Tmax: string;
  Tmin: string;
  Ra: string;
  Emax: string;
  E: string;
}

interface TableState {
  currentTable1: ITableRow[];
  currentTable2: ITableRow[];
  selectedTableName1: string;
  selectedTableName2: string;
}

interface IHandleChangeSelectChangeProps {
  event: SelectChangeEvent;
  setSelectedTableName: ActionCreatorWithPayload<{
    newSelectedTableName: string;
  }>;
  setTable: ActionCreatorWithPayload<{
    newTable: ITableRow[];
  }>;
}

interface IDateRange {
  from: string;
  to: string;
}

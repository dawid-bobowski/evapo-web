/// <reference types="vite/client" />

interface ITableRow {
  date: string;
  T: number | null;
  Rs: number | null;
  RH: number | null;
  V: number | null;
  P: number | null;
  RH13: number | null;
  RHmin: number | null;
  Tmax: number | null;
  Tmin: number | null;
  Ra: number | null;
  Emax: number | null;
  E: number | null;
  Et0: number | null;
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

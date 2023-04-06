/// <reference types="vite/client" />

interface ITableRow {
  date: string;
  temperature: Number;
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
  currentTable: ITableRow[];
  selectedTableName: string;
}

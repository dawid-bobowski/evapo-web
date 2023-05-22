/// <reference types="vite/client" />

interface ITableRow {
  Data: string;
  T: number;
  RH: number;
  V: number;
  P: number;
  Ra: number;
  es: number;
  ea: number;
  VPD: number;
  RS0: number;
  Rs: number;
  RNL: number;
  RNS: number;
  ET0: number;
}

interface IDataRow {
  Data: string;
  T: number;
  RH: number;
  V: number;
  P: number;
  Ra: number;
  es: number;
  ea: number;
  VPD: number;
  RS0: number;
  Rs: number;
  RNL: number;
  RNS: number;
  ET0: number;
}

interface TableState {
  selectedTableNames: string[];
  selectedTables: ITableRow[][];
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

/// <reference types="vite/client" />

interface ITableRow {
  date: string;
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

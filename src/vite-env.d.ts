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

interface IChartDataRow {
  Data: string;
  [key: typeof string]: number;
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
  selectedMonth: string;
}

interface ChartsState {
  mainChartData: IChartDataRow[];
  tempChartRef: IChartDataRow[];
  evapoChartRef: IChartDataRow[];
  wasMonthSelected: boolean;
  refAreaLeft: string;
  refAreaLeft_ET0: string;
  refAreaRight: string;
  refAreaRight_ET0: string;
  left: string;
  left_ET0: string;
  right: string;
  right_ET0: string;
  top: number | null;
  top_ET0: number | null;
  bottom: number | null;
  bottom_ET0: number | null;
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

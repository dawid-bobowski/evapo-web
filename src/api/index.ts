import _ from 'lodash';
import { calculateEvapo } from '../utils';

export const getDbTable = async (selectedTableName: string): Promise<ITableRow[]> => {
  const response: Response = await fetch(`http://127.0.0.1:3000/table/${selectedTableName}`, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: IDataRow[] = await response.json();
  const parsedData: ITableRow[] = data.map((row: IDataRow) => {
    let newRow = {
      date: row.Dzien,
      T: row.T ? _.toNumber(row.T.replace(',', '.')) : null,
      RH: row.RH ? _.toNumber(row.RH.replace(',', '.')) : null,
      Ra: row.Ra ? _.toNumber(row.Ra.replace(',', '.')) : null,
      Rs: row.Rs ? _.toNumber(row.Rs.replace(',', '.')) : null,
      V: row.V ? _.toNumber(row.V.replace(',', '.')) : null,
      E: row.E ? _.toNumber(row.E.replace(',', '.')) : null,
      P: row.P ? _.toNumber(row.P.replace(',', '.')) : null,
      RH13: row.RH13 ? _.toNumber(row.RH13.replace(',', '.')) : null,
      RHmin: row.RHmin ? _.toNumber(row.RHmin.replace(',', '.')) : null,
      Tmax: row.Tmax ? _.toNumber(row.Tmax.replace(',', '.')) : null,
      Tmin: row.Tmin ? _.toNumber(row.Tmin.replace(',', '.')) : null,
      Emax: row.Emax ? _.toNumber(row.Emax.replace(',', '.')) : null,
    };
    const Et0: number | null = calculateEvapo({
      RH: newRow.RH,
      R_a: newRow.Ra,
      R_s: newRow.Rs,
      T: newRow.T,
      V: newRow.V,
    });
    return {
      ...newRow,
      Et0,
    };
  });
  return parsedData;
};

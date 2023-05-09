import _ from 'lodash';
import { calculateEvapo } from '../utils';

export const getDbTable = async (selectedTableName: string): Promise<ITableRow[]> => {
  const response: Response = await fetch(`http://127.0.0.1:3000/table/${selectedTableName}`, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: IDataRow[] = await response.json();
  const parsedData: ITableRow[] = data.map((row: IDataRow) => {
    let parsedRow = {
      ...row,
      date: row.Data.slice(5),
    };
    // const Et0: number | null = calculateEvapo({
    //   RH: parsedRow.RH,
    //   R_a: parsedRow.Ra,
    //   R_s: parsedRow.Rs,
    //   T: parsedRow.T,
    //   V: parsedRow.V,
    // });
    return parsedRow;
  });
  return parsedData;
};

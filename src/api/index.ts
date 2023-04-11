import _ from 'lodash';

export const getDbTable = async (selectedTableName: string): Promise<ITableRow[]> => {
  const response: Response = await fetch(`http://127.0.0.1:3000/table/${selectedTableName}`, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: IDataRow[] = await response.json();
  const parsedData: ITableRow[] = data.map((row: IDataRow) => ({
    date: row.Dzien,
    temperature: _.toNumber(row.T.replace(',', '.')),
  }));
  return parsedData;
};

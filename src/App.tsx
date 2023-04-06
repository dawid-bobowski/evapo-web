import { useEffect } from 'react';
import _ from 'lodash';
import MainChart from './components/MainChart';

import { useAppDispatch, useAppSelector } from './app/hooks';
import { setTable } from './features/table/tableSlice';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const selectedTableName: string = useAppSelector((state) => state.table.selectedTableName);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/table/${selectedTableName}`, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data: IDataRow[]) => {
        const parsedData = data.map((row) => ({
          date: row.Dzien,
          temperature: _.toNumber(row.T.replace(',', '.')),
        }));
        dispatch(setTable({ newTable: parsedData }));
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className='App'>
      <h1>{selectedTableName}</h1>
      <MainChart />
    </div>
  );
}

export default App;

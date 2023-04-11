import _ from 'lodash';

import MainChart from './components/MainChart';
import { useAppSelector } from './app/hooks';
import './App.css';

function App() {
  const selectedTableName: string = useAppSelector((state) => state.table.selectedTableName);

  return (
    <div className='App'>
      <h1>{selectedTableName}</h1>
      <MainChart />
    </div>
  );
}

export default App;

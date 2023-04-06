import { LineChart, CartesianGrid, Line, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import Card from '@mui/material/Card';

import { useAppSelector } from '../app/hooks';
import TableSelect from './TableSelect';
import './MainChart.css';

const MainChart = () => {
  const currentTable: ITableRow[] = useAppSelector((state) => state.table.currentTable);

  return (
    <div id='table'>
      <Card
        variant='outlined'
        sx={{
          padding: '3rem 4rem 3rem 1rem',
        }}
      >
        <div style={{ width: '100%', marginLeft: '5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <TableSelect />
        </div>
        <LineChart
          width={1100}
          height={500}
          data={currentTable}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            label={{ value: 'Dzień', position: 'insideBottomRight', offset: -20 }}
          />
          <YAxis label={{ value: 'Temperatura ', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            labelFormatter={() => (
              <div>
                <span>Dzień: </span>
              </div>
            )}
          />
          <Legend payload={[{ value: 'temperatura [°C]', color: '#002d80', type: 'line' }]} />
          <Line
            type='monotone'
            dataKey='temperature'
            stroke='#002d80'
          />
        </LineChart>
      </Card>
    </div>
  );
};

export default MainChart;

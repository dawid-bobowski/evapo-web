import {
  LineChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setTable } from '../features/table/tableSlice';
import CustomTooltip from './CustomTooltip';
import TableSelect from './TableSelect';
import { getDbTable } from '../api';
import { convertDate } from '../utils';

const getAxisYDomain = (
  data: ITableRow[],
  from: string,
  to: string,
  field: keyof ITableRow,
  offset: number
): number[] => {
  const startIndex: number = data.findIndex((item) => item.date === from);
  const endIndex: number = data.findIndex((item) => item.date === to);
  const refData: ITableRow[] = data.slice(startIndex, endIndex + 1);
  let [bottom, top]: [bottom: number | string, top: number | string] = [refData[0][field], refData[0][field]];
  refData.forEach((d: ITableRow) => {
    if (d[field] > top) top = d[field];
    if (d[field] < bottom) bottom = d[field];
  });

  return [_.round((bottom as number | 0) - offset, 1), _.round((top as number | 0) + offset, 1)];
};

const MainChart = () => {
  const dispatch = useAppDispatch();
  const selectedTableName: string = useAppSelector((state) => state.table.selectedTableName);
  const [currentTable, setCurrentTable] = useState<ITableRow[]>([]);
  const [refTable, setRefTable] = useState<ITableRow[]>([]);
  const [refAreaLeft, setRefAreaLeft] = useState<string>('');
  const [refAreaRight, setRefAreaRight] = useState<string>('');
  const [left, setLeft] = useState<string>('');
  const [right, setRight] = useState<string>('');
  const [top, setTop] = useState<number | string>('');
  const [bottom, setBottom] = useState<number | string>('');

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // xAxis domain
    let refLeft = refAreaLeft;
    let refRight = refAreaRight;
    let refAreaLeftIndex = _.indexOf(
      currentTable,
      currentTable.find((el) => el.date === refAreaLeft)
    );
    let refAreaRightIndex = _.indexOf(
      currentTable,
      currentTable.find((el) => el.date === refAreaRight)
    );

    if (refAreaLeftIndex > refAreaRightIndex) {
      refRight = [refLeft, (refLeft = refRight)][0];
      refAreaRightIndex = [refAreaLeftIndex, (refAreaLeftIndex = refAreaRightIndex)][0];
    }

    // // yAxis domain
    const [newBottom, newTop] = getAxisYDomain(currentTable, refLeft, refRight, 'temperature', 1);

    setRefTable(currentTable.slice(refAreaLeftIndex, refAreaRightIndex + 1));
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(refLeft);
    setRight(refRight);
    setTop(newTop);
    setBottom(newBottom);
  };

  const resetZoom = () => {
    const [newBottom, newTop] = getAxisYDomain(
      currentTable,
      currentTable[0].date,
      currentTable[currentTable.length - 1].date,
      'temperature',
      1
    );

    setRefTable(currentTable);
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(currentTable[0].date);
    setRight(currentTable[currentTable.length - 1].date);
    setTop(newTop);
    setBottom(newBottom);
  };

  useEffect(() => {
    getDbTable(selectedTableName)
      .then((newData) => {
        dispatch(setTable({ newTable: newData }));
        setCurrentTable(newData);
        setRefTable(newData);
        const [newBottom, newTop] = getAxisYDomain(
          newData,
          newData[0].date,
          newData[newData.length - 1].date,
          'temperature',
          1
        );
        setTop(newTop);
        setBottom(newBottom);
      })
      .catch((error) => console.error(error));
  }, [selectedTableName]);

  return (
    <div id='table'>
      <Card
        variant='outlined'
        sx={{
          padding: '3rem 4rem 3rem 1rem',
        }}
      >
        <Box style={{ width: 1100, marginLeft: '5rem', display: 'flex', justifyContent: 'flex-start' }}>
          <TableSelect />
          <Button
            onClick={resetZoom}
            sx={{
              width: 80,
              lineHeight: 1.5,
              fontWeight: 'bold',
              height: '2.5rem',
              alignSelf: 'flex-start',
              marginBottom: '2rem',
              marginLeft: '1rem',
              color: '#002d80',
              backgroundColor: '#fff',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: '#eee',
              },
            }}
          >
            Reset
          </Button>
        </Box>
        <ResponsiveContainer
          width='100%'
          height={500}
        >
          <LineChart
            width={1100}
            height={500}
            data={refTable}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseDown={(e) => {
              if (e.activeLabel) {
                setRefAreaLeft(e.activeLabel);
              }
            }}
            onMouseMove={(e) => {
              if (e.activeLabel) {
                setRefAreaRight(e.activeLabel);
              }
            }}
            onMouseUp={zoom}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              horizontalPoints={[150, 300]}
            />
            <XAxis
              dataKey='date'
              padding='gap'
              allowDataOverflow
              domain={[left, right]}
              label={{ value: 'Dzień', position: 'insideBottomRight', offset: -20 }}
              tickFormatter={(value: string) => convertDate(value)}
              tickCount={10}
            />
            <YAxis
              dataKey='temperature'
              yAxisId='1'
              padding={{ bottom: 10, top: 10 }}
              allowDataOverflow
              domain={[bottom, top]}
              label={{ value: 'Temperatura', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{
                color: '#fff',
                backgroundColor: '#000',
                padding: '0 1rem',
                opacity: 0.8,
              }}
            />
            <Legend payload={[{ value: 'temperatura [°C]', color: '#002d80', type: 'line' }]} />
            <Line
              yAxisId='1'
              type='monotone'
              dataKey='temperature'
              stroke='#002d80'
              animationDuration={300}
            />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                yAxisId='1'
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MainChart;

import {
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';
import { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { setSelectedTableName1, setSelectedTableName2, setTable1, setTable2 } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain, setRefTables } from '../utils';
import CustomTooltip from './CustomTooltip';
import TableSelect from './TableSelect';
import { getDbTable } from '../api';
import { DB_NAMES } from '../constants';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const [selectedTableNamesT, setSelectedTableNamesT] = useState<string[]>([]);
  const [currentTableT, setCurrentTableT] = useState<ITableRow[]>([]);
  const [currentTable2, setCurrentTable2] = useState<ITableRow[]>([]);
  const [refTableT, setRefTableT] = useState<ITableRow[]>([]);
  const [refTable2, setRefTable2] = useState<ITableRow[]>([]);
  const [refAreaLeft, setRefAreaLeft] = useState<string>('');
  const [refAreaRight, setRefAreaRight] = useState<string>('');
  const [left, setLeft] = useState<string>('');
  const [right, setRight] = useState<string>('');
  const [top, setTop] = useState<number | null>(null);
  const [bottom, setBottom] = useState<number | null>(null);

  const handleChange = (props: IHandleChangeSelectChangeProps) => {
    const { event, setSelectedTableName, setTable } = props;
    dispatch(setSelectedTableName({ newSelectedTableName: event.target.value }));
    getDbTable(event.target.value)
      .then((newData) => dispatch(setTable({ newTable: newData })))
      .catch((error) => console.error(error));
  };

  /**
   * Performs zoom in on both tables.
   */
  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaLeft === '' || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // xAxis domain
    let refLeft = refAreaLeft;
    let refRight = refAreaRight;
    let refAreaLeftIndex = _.indexOf(
      currentTableT,
      currentTableT.find((el) => el.date === refAreaLeft)
    );
    let refAreaRightIndex = _.indexOf(
      currentTableT,
      currentTableT.find((el) => el.date === refAreaRight)
    );

    if (refAreaLeftIndex > refAreaRightIndex) {
      refRight = [refLeft, (refLeft = refRight)][0];
      refAreaRightIndex = [refAreaLeftIndex, (refAreaLeftIndex = refAreaRightIndex)][0];
    }
    if (refLeft === '' || refRight === '') return;
    // yAxis domain
    const [newBottom, newTop] = getAxisYDomain(currentTableT, refLeft, refRight, 'T', 1);

    setRefTableT(currentTableT.slice(refAreaLeftIndex, refAreaRightIndex + 1));
    setRefTable2(currentTable2.slice(refAreaLeftIndex, refAreaRightIndex + 1));
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(refLeft);
    setRight(refRight);
    setTop(newTop);
    setBottom(newBottom);
  };

  /**
   * Resets zoom on both tables.
   */
  // const resetZoom = () => {
  //   setRefTables({
  //     currentTableT,
  //     currentTable2,
  //     setLeft,
  //     setRight,
  //     setTop,
  //     setBottom,
  //     setRefTableT,
  //     setRefTable2,
  //   });
  // };

  // useEffect(() => {
  //   getDbTable(selectedTableName1)
  //     .then((newData: ITableRow[]) => {
  //       const [newBottom, newTop] = getAxisYDomain(newData, newData[0].date, newData[newData.length - 1].date, 'T', 1);
  //       setTop(newTop);
  //       setBottom(newBottom);
  //       dispatch(setTable1({ newTable: newData }));
  //       setcurrentTableT(newData);
  //       setRefTableT(newData);
  //     })
  //     .catch((error) => console.error(error));
  // }, [selectedTableName1]);

  // useEffect(() => {
  //   getDbTable(selectedTableName2)
  //     .then((newData: ITableRow[]) => {
  //       const [newBottom, newTop] = getAxisYDomain(newData, newData[0].date, newData[newData.length - 1].date, 'T', 1);
  //       setTop(newTop);
  //       setBottom(newBottom);
  //       dispatch(setTable2({ newTable: newData }));
  //       setCurrentTable2(newData);
  //       setRefTable2(newData);
  //     })
  //     .catch((error) => console.error(error));
  // }, [selectedTableName2]);

  // useEffect(() => {
  //   setRefTables({
  //     currentTableT,
  //     currentTable2,
  //     setLeft,
  //     setRight,
  //     setTop,
  //     setBottom,
  //     setRefTableT,
  //     setRefTable2,
  //   });
  // }, [currentTableT, currentTable2]);

  return (
    <Box id='main-window'>
      <Box
        id='menu'
        sx={{
          width: '200px',
          height: 'calc(100vh - 10rem)',
          padding: '5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#fff',
          position: 'fixed',
        }}
      >
        <FormControl
          size='small'
          sx={{
            marginBottom: '2rem',
            width: 160,
          }}
        >
          <InputLabel id='table-select-label'>Wybierz lata</InputLabel>
          <Select
            multiple
            value={selectedTableNamesT}
            onChange={(event: SelectChangeEvent<string[]>) => {
              if (typeof event.target.value === 'string') return;
              setSelectedTableNamesT(event.target.value);
            }}
          >
            {DB_NAMES.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          // onClick={resetZoom}
          sx={{
            width: 80,
            lineHeight: 1.5,
            fontWeight: 'bold',
            height: '2.5rem',
            marginBottom: '2rem',
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
      <Box
        id='charts'
        sx={{
          width: 'calc(100% - 200px - 4rem)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '3rem',
          marginLeft: 'calc(200px + 4rem)',
        }}
      >
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <ComposedChart
            syncId='tables'
            width={900}
            height={300}
            data={refTableT}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseDown={(event) => {
              if (event && event.activeLabel) {
                setRefAreaLeft(event.activeLabel);
              }
            }}
            onMouseMove={(event) => {
              if (event && event.activeLabel && refAreaLeft !== '') {
                setRefAreaRight(event.activeLabel);
              }
            }}
            onMouseUp={zoom}
          >
            <defs>
              <linearGradient
                id='colorEt0'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='5%'
                  stopColor='#3467c4'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#3467c4'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke='#fff'
              strokeDasharray='3 3'
              horizontalPoints={[5, 80, 160]}
            />
            <XAxis
              dataKey='date'
              padding='gap'
              domain={[left, right]}
              label={{ value: 'Dzień', position: 'insideBottomRight', offset: -20, stroke: '#fff', dx: -60 }}
              tickCount={10}
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <YAxis
              dataKey='T'
              yAxisId='T'
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom as number, top as number]}
              label={{ value: 'Temperatura', angle: -90, position: 'left', stroke: '#fff', dy: -45 }}
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <YAxis
              dataKey='ET0'
              yAxisId='ET0'
              orientation='right'
              padding={{ bottom: 10, top: 10 }}
              domain={[0, 10]}
              label={{ value: 'Ewapotranspiracja', angle: 90, position: 'right', stroke: '#fff', dy: -65 }}
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <Area
              type='monotone'
              dataKey='ET0'
              yAxisId='ET0'
              stroke='#3467c4'
              fill='url(#colorEt0)'
              animationDuration={300}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='T'
              yAxisId='T'
              stroke='#2fc4ff'
              strokeWidth={2}
              animationDuration={300}
              dot={false}
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
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                yAxisId='T'
                x1={refAreaLeft}
                x2={refAreaRight}
                fillOpacity={0.3}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default MainChart;

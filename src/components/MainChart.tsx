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
import { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { setSelectedTableNames, setSelectedTables } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain, setRefTables } from '../utils';
import CustomTooltip from './CustomTooltip';
import TableSelect from './TableSelect';
import { getDbTable } from '../api';
import { DB_NAMES } from '../constants';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const [selectedChartNames, setSelectedChartNames] = useState<string[]>(
    useAppSelector((state) => state.tables.selectedTableNames)
  );
  const [selectedCharts, setSelectedCharts] = useState<ITableRow[][]>(
    useAppSelector((state) => state.tables.selectedTables)
  );
  const [tempChartData, setTempChartData] = useState<ITempChartDataRow[]>([]);
  const [refTableT, setRefTableT] = useState<ITempChartDataRow[]>([]);

  const [refAreaLeft, setRefAreaLeft] = useState<string>('');
  const [refAreaRight, setRefAreaRight] = useState<string>('');
  const [left, setLeft] = useState<string>('');
  const [right, setRight] = useState<string>('');
  const [top, setTop] = useState<number | null>(null);
  const [bottom, setBottom] = useState<number | null>(null);

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
      tempChartData,
      tempChartData.find((el) => el.Data === refAreaLeft)
    );
    let refAreaRightIndex = _.indexOf(
      tempChartData,
      tempChartData.find((el) => el.Data === refAreaRight)
    );

    if (refAreaLeftIndex > refAreaRightIndex) {
      refRight = [refLeft, (refLeft = refRight)][0];
      refAreaRightIndex = [refAreaLeftIndex, (refAreaLeftIndex = refAreaRightIndex)][0];
    }
    if (refLeft === '' || refRight === '') return;
    // yAxis domain
    const [newBottom, newTop] = getAxisYDomain(tempChartData, refLeft, refRight, 'T', 1);

    setRefTableT(tempChartData.slice(refAreaLeftIndex, refAreaRightIndex + 1));
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

  useEffect(() => {
    _.forEach(selectedChartNames, (tableName) => {
      getDbTable(tableName)
        .then((newData: ITableRow[]) => {
          const [newBottom, newTop] = getAxisYDomain(
            newData,
            newData[0].Data,
            newData[newData.length - 1].Data,
            'T',
            1
          );
          setTop(newTop);
          setBottom(newBottom);
          dispatch(
            setSelectedTables({
              newTables: [...selectedCharts, newData],
            })
          );
          setSelectedCharts([...selectedCharts, newData]);
          const year: string = tableName.replace(/\D/g, '');
          const newTempChartData: ITempChartDataRow[] = newData.map((data) => ({
            Data: data.Data.slice(5),
            [`T${year}`]: data.T,
          }));
          setTempChartData(newTempChartData);
        })
        .catch((error) => console.error(error));
    });
  }, []);

  useEffect(() => {
    console.log(tempChartData);
  }, [tempChartData]);

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
            value={selectedChartNames}
            onChange={(event: SelectChangeEvent<string[]>) => {
              if (typeof event.target.value === 'string') {
                return;
              } else if (_.isEmpty(event.target.value)) {
                setTop(null);
                setBottom(null);
                dispatch(
                  setSelectedTables({
                    newTables: [],
                  })
                );
                setSelectedCharts([]);
              }
              setSelectedChartNames(event.target.value);
              setSelectedTableNames({ newNames: event.target.value });
              let addedChart: string[] = _.difference(event.target.value, selectedChartNames);
              let deletedChart: string[] = _.difference(selectedChartNames, event.target.value);
              if (!_.isEmpty(addedChart)) {
                getDbTable(addedChart[0])
                  .then((newData: ITableRow[]) => {
                    const [newBottom, newTop] = getAxisYDomain(
                      newData,
                      newData[0].Data,
                      newData[newData.length - 1].Data,
                      'T',
                      1
                    );
                    (top === null || newTop > top) && setTop(newTop);
                    (bottom === null || newBottom > bottom) && setBottom(newBottom);
                    dispatch(setSelectedTables({ newTables: [...selectedCharts, newData] }));
                    setSelectedCharts([...selectedCharts, newData]);
                    const year: string = addedChart[0].replace(/\D/g, '');
                    const newTempChartData: ITempChartDataRow[] = tempChartData.map((dataRow, idx) => ({
                      ...dataRow,
                      [`T${year}`]: newData[idx].T,
                    }));
                    setTempChartData(newTempChartData);
                  })
                  .catch((error) => console.error(error));
              }
              if (!_.isEmpty(deletedChart)) {
                const updatedTables: ITableRow[][] = selectedCharts.filter(
                  (chart) => deletedChart[0].replace(/\D/g, '') !== chart[0].Data.slice(0, 4)
                );
                dispatch(setSelectedTables({ newTables: updatedTables }));
                setSelectedCharts(updatedTables);
                _.forEach(updatedTables, (updatedTable) => {
                  const [newBottom, newTop] = getAxisYDomain(
                    updatedTable,
                    updatedTable[0].Data,
                    updatedTable[updatedTable.length - 1].Data,
                    'T',
                    1
                  );
                  setTop(newTop);
                  setBottom(newBottom);
                });
                const year: string = deletedChart[0].replace(/\D/g, '');
                let newTempChartData: ITempChartDataRow[] = tempChartData.map((dataRow) => {
                  const keys: string[] = Object.keys(dataRow)
                    .filter((key) => key.slice(1) !== year)
                    .filter((key) => key.slice(1) !== 'Data');
                  let newRowData: ITempChartDataRow = {
                    Data: dataRow.Data,
                  };
                  _.forEach(keys, (key) => {
                    newRowData[key as keyof ITempChartDataRow] = dataRow[key as keyof ITempChartDataRow];
                  });
                  return newRowData;
                });
                setTempChartData(newTempChartData);
              }
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
            {/* <YAxis
              dataKey='ET0'
              yAxisId='ET0'
              orientation='right'
              padding={{ bottom: 10, top: 10 }}
              domain={[0, 10]}
              label={{ value: 'Ewapotranspiracja', angle: 90, position: 'right', stroke: '#fff', dy: -65 }}
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            /> */}
            {/* <Area
              type='monotone'
              dataKey='ET0'
              yAxisId='ET0'
              stroke='#3467c4'
              fill='url(#colorEt0)'
              animationDuration={300}
              dot={false}
            /> */}
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

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
} from 'recharts';
import { useEffect, useState } from 'react';
import { FormControl, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { setSelectedTableNames, setSelectedTables } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain } from '../utils';
import CustomTooltip from './CustomTooltip';
import { getDbTable } from '../api';
import { CHART_COLORS, DB_NAMES, MONTHS } from '../constants';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const [selectedChartNames, setSelectedChartNames] = useState<string[]>(
    useAppSelector((state) => state.tables.selectedTableNames)
  );
  const [selectedCharts, setSelectedCharts] = useState<ITableRow[][]>(
    useAppSelector((state) => state.tables.selectedTables)
  );
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isManualRefArea, setIsManualRefArea] = useState<boolean>(false);

  const [tempChartData, setTempChartData] = useState<ITempChartDataRow[]>([]);
  const [tempChartRef, setTempChartRef] = useState<ITempChartDataRow[]>([]);

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
    const [newBottom, newTop] = getAxisYDomain(tempChartData, refLeft, refRight, 1);

    setTempChartRef(tempChartData.slice(refAreaLeftIndex, refAreaRightIndex + 1));
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
  const resetZoom = () => {
    const [newBottom, newTop] = getAxisYDomain(
      tempChartData,
      tempChartData[0].Data,
      tempChartData[tempChartData.length - 1].Data,
      1
    );
    setTop(newTop);
    setBottom(newBottom);
    setTempChartRef(tempChartData);
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(tempChartData[0].Data);
    setRight(tempChartData[tempChartData.length - 1].Data);
    setSelectedMonth('');
  };

  useEffect(() => {
    _.forEach(selectedChartNames, (tableName) => {
      getDbTable(tableName)
        .then((newData: ITableRow[]) => {
          setSelectedCharts([...selectedCharts, newData]);
          const year: string = tableName.replace(/\D/g, '');
          const newTempChartData: ITempChartDataRow[] = newData.map((data) => ({
            Data: data.Data.slice(5),
            [`T${year}`]: data.T,
          }));
          setTempChartData(newTempChartData);
          setTempChartRef(newTempChartData);
          const [newBottom, newTop] = getAxisYDomain(
            newTempChartData,
            newTempChartData[0].Data,
            newTempChartData[newTempChartData.length - 1].Data,
            1
          );
          setTop(newTop);
          setBottom(newBottom);
          dispatch(
            setSelectedTables({
              newTables: [...selectedCharts, newData],
            })
          );
        })
        .catch((error) => console.error(error));
    });
  }, []);

  useEffect(() => {
    if (selectedMonth === '') return;
    const month: number = MONTHS.findIndex((month) => month === selectedMonth) + 4;
    const daysInMonth: number = new Date(2020, month, 0).getDate();
    setRefAreaLeft(`${month !== 10 ? `0${month}` : month}-01`);
    setRefAreaRight(`${month !== 10 ? `0${month}` : month}-${daysInMonth}`);
    setIsManualRefArea(true);
  }, [selectedMonth]);

  useEffect(() => {
    if (isManualRefArea) {
      setIsManualRefArea(false);
      zoom();
    }
  }, [isManualRefArea]);

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
        <FormLabel>Wybierz max 3 lata:</FormLabel>
        <FormControl
          size='small'
          sx={{
            marginBottom: '2rem',
            width: 160,
          }}
        >
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
              let addedChart: string[] = _.difference(event.target.value, selectedChartNames);
              let deletedChart: string[] = _.difference(selectedChartNames, event.target.value);

              if (selectedChartNames.length === 3 && _.isEmpty(deletedChart)) return;

              setSelectedChartNames(event.target.value);
              setSelectedTableNames({ newNames: event.target.value });

              if (!_.isEmpty(addedChart)) {
                getDbTable(addedChart[0])
                  .then((newData: ITableRow[]) => {
                    dispatch(setSelectedTables({ newTables: [...selectedCharts, newData] }));
                    setSelectedCharts([...selectedCharts, newData]);
                    const year: string = addedChart[0].replace(/\D/g, '');
                    const newTempChartData: ITempChartDataRow[] = tempChartData.map((dataRow, idx) => ({
                      ...dataRow,
                      [`T${year}`]: newData[idx].T,
                    }));
                    setTempChartData(newTempChartData);
                    setTempChartRef(newTempChartData);
                    const [newBottom, newTop] = getAxisYDomain(
                      newTempChartData,
                      newTempChartData[0].Data,
                      newTempChartData[newTempChartData.length - 1].Data,
                      1
                    );
                    setTop(newTop);
                    setBottom(newBottom);
                    setSelectedMonth('');
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
                const [newBottom, newTop] = getAxisYDomain(
                  newTempChartData,
                  newTempChartData[0].Data,
                  newTempChartData[newTempChartData.length - 1].Data,
                  1
                );
                setTop(newTop);
                setBottom(newBottom);
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
        <FormLabel>Wybierz miesiąc:</FormLabel>
        <FormControl
          size='small'
          sx={{
            marginBottom: '2rem',
            width: 160,
          }}
        >
          <Select
            value={selectedMonth}
            onChange={(event: SelectChangeEvent<string>) => {
              setSelectedMonth(event.target.value);
            }}
          >
            {MONTHS.map((month) => (
              <MenuItem
                key={month}
                value={month}
              >
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          onClick={resetZoom}
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
          width: 'calc(100% - 200px - 10rem)',
          minHeight: 'calc(100vh - 6rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          marginLeft: 'calc(200px + 4rem)',
          paddingTop: '6rem',
        }}
      >
        {/* <Typography
          variant='h3'
          sx={{
            color: '#fff',
            fontFamily: 'Inter',
            textAlign: 'left',
            padding: '0 3rem',
          }}
        >
          Temperatura
        </Typography> */}
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <ComposedChart
            width={900}
            height={300}
            data={tempChartRef}
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
            style={{
              backgroundColor: '#fff',
              margin: '0 3rem',
              padding: '2rem 0',
            }}
          >
            <CartesianGrid
              stroke='#00000050'
              strokeDasharray='3 3'
              horizontalPoints={[5, 80, 160]}
            />
            <XAxis
              dataKey='Data'
              padding='gap'
              domain={[left, right]}
              tickCount={10}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            <YAxis
              dataKey='T2021'
              yAxisId='T'
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom as number, top as number]}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            {!_.isEmpty(tempChartData) &&
              Object.keys(tempChartData[0])
                .filter((key) => key !== 'Data')
                .map((key, idx) => {
                  return (
                    <Line
                      key={key}
                      type='monotone'
                      dataKey={key}
                      yAxisId='T'
                      stroke={CHART_COLORS[idx]}
                      strokeWidth={2}
                      animationDuration={300}
                      dot={false}
                    />
                  );
                })}
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

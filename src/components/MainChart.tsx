import {
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  ComposedChart,
  Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import { FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { setSelectedTableNames, setSelectedTables } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain, zoom } from '../utils';
import CustomTooltip from './CustomTooltip';
import { getDbTable } from '../api';
import { TEMP_CHART_COLORS, DB_NAMES, MAIN_UNIT, MONTHS, EVAPO_CHART_COLORS } from '../constants';
import { EVAPO_UNIT } from '../constants';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const [selectedChartNames, setSelectedChartNames] = useState<string[]>(
    useAppSelector((state) => state.tables.selectedTableNames)
  );
  const [selectedCharts, setSelectedCharts] = useState<ITableRow[][]>(
    useAppSelector((state) => state.tables.selectedTables)
  );
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const [mainChartData, setMainChartData] = useState<IChartDataRow[]>([]);
  const [tempChartRef, setTempChartRef] = useState<IChartDataRow[]>([]);
  const [evapoChartRef, setEvapoChartRef] = useState<IChartDataRow[]>([]);

  // Temperature
  const [isManualRefArea, setIsManualRefArea] = useState<boolean>(false);
  const [refAreaLeft, setRefAreaLeft] = useState<string>('');
  const [refAreaRight, setRefAreaRight] = useState<string>('');
  const [left, setLeft] = useState<string>('');
  const [right, setRight] = useState<string>('');
  const [top, setTop] = useState<number | null>(null);
  const [bottom, setBottom] = useState<number | null>(null);

  // Evapotranspiration
  const [isManualRefArea_ET0, setIsManualRefArea_ET0] = useState<boolean>(false);
  const [refAreaLeft_ET0, setRefAreaLeft_ET0] = useState<string>('');
  const [refAreaRight_ET0, setRefAreaRight_ET0] = useState<string>('');
  const [left_ET0, setLeft_ET0] = useState<string>('');
  const [right_ET0, setRight_ET0] = useState<string>('');
  const [top_ET0, setTop_ET0] = useState<number | null>(null);
  const [bottom_ET0, setBottom_ET0] = useState<number | null>(null);

  /**
   * Resets zoom on both tables.
   */
  const resetZoom = () => {
    const [newBottom, newTop] = getAxisYDomain(
      mainChartData,
      mainChartData[0].Data,
      mainChartData[mainChartData.length - 1].Data,
      MAIN_UNIT,
      1
    );
    setTop(newTop);
    setBottom(newBottom);
    setTempChartRef(mainChartData);
    setRefAreaLeft('');
    setRefAreaRight('');
    setLeft(mainChartData[0].Data);
    setRight(mainChartData[mainChartData.length - 1].Data);

    const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
      mainChartData,
      mainChartData[0].Data,
      mainChartData[mainChartData.length - 1].Data,
      EVAPO_UNIT,
      1
    );
    setTop_ET0(newTop_ET0);
    setBottom_ET0(newBottom_ET0);
    setEvapoChartRef(mainChartData);
    setRefAreaLeft_ET0('');
    setRefAreaRight_ET0('');
    setLeft_ET0(mainChartData[0].Data);
    setRight_ET0(mainChartData[mainChartData.length - 1].Data);

    setSelectedMonth('');
  };

  useEffect(() => {
    _.forEach(selectedChartNames, (tableName) => {
      getDbTable(tableName)
        .then((newData: ITableRow[]) => {
          setSelectedCharts([...selectedCharts, newData]);
          const year: string = tableName.replace(/\D/g, '');
          const newChartData: IChartDataRow[] = newData.map((data) => ({
            Data: data.Data.slice(5),
            [`${MAIN_UNIT}${year}`]: data.T,
            [`${EVAPO_UNIT}${year}`]: data.ET0,
          }));
          setMainChartData(newChartData);
          setTempChartRef(newChartData);
          setEvapoChartRef(newChartData);

          const [newBottom, newTop] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            MAIN_UNIT,
            1
          );
          setTop(newTop);
          setBottom(newBottom);

          const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            EVAPO_UNIT,
            1
          );
          setTop_ET0(newTop_ET0);
          setBottom_ET0(newBottom_ET0);

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

    setRefAreaLeft_ET0(`${month !== 10 ? `0${month}` : month}-01`);
    setRefAreaRight_ET0(`${month !== 10 ? `0${month}` : month}-${daysInMonth}`);
    setIsManualRefArea_ET0(true);
  }, [selectedMonth]);

  useEffect(() => {
    if (isManualRefArea) {
      setIsManualRefArea(false);
      zoom({
        unit: MAIN_UNIT,
        refAreaLeft,
        refAreaRight,
        refChartData: mainChartData,
        setLeft,
        setRight,
        setTop,
        setBottom,
        setRefAreaLeft,
        setRefAreaRight,
        setRefChartRef: setTempChartRef,
      });
    }
  }, [isManualRefArea]);

  useEffect(() => {
    if (isManualRefArea_ET0) {
      setIsManualRefArea_ET0(false);
      zoom({
        unit: EVAPO_UNIT,
        refAreaLeft: refAreaLeft_ET0,
        refAreaRight: refAreaRight_ET0,
        refChartData: mainChartData,
        setLeft: setLeft_ET0,
        setRight: setRight_ET0,
        setTop: setTop_ET0,
        setBottom: setBottom_ET0,
        setRefAreaLeft: setRefAreaLeft_ET0,
        setRefAreaRight: setRefAreaRight_ET0,
        setRefChartRef: setEvapoChartRef,
      });
    }
  }, [isManualRefArea_ET0]);

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
        <FormLabel>Wybierz max 3 roczniki:</FormLabel>
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
                    const newChartData: IChartDataRow[] = mainChartData.map((dataRow, idx) => ({
                      ...dataRow,
                      [`${MAIN_UNIT}${year}`]: newData[idx].T,
                      [`ET0${year}`]: newData[idx].ET0,
                    }));
                    setMainChartData(newChartData);

                    setTempChartRef(newChartData);
                    const [newBottom, newTop] = getAxisYDomain(
                      newChartData,
                      newChartData[0].Data,
                      newChartData[newChartData.length - 1].Data,
                      MAIN_UNIT,
                      1
                    );
                    setTop(newTop);
                    setBottom(newBottom);

                    setEvapoChartRef(newChartData);
                    const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
                      newChartData,
                      newChartData[0].Data,
                      newChartData[newChartData.length - 1].Data,
                      EVAPO_UNIT,
                      1
                    );
                    setTop_ET0(newTop_ET0);
                    setBottom_ET0(newBottom_ET0);

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
                    MAIN_UNIT,
                    1
                  );
                  setTop(newTop);
                  setBottom(newBottom);

                  const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
                    updatedTable,
                    updatedTable[0].Data,
                    updatedTable[updatedTable.length - 1].Data,
                    EVAPO_UNIT,
                    1
                  );
                  setTop_ET0(newTop_ET0);
                  setBottom_ET0(newBottom_ET0);
                });
                const year: string = deletedChart[0].replace(/\D/g, '');
                let newChartData: IChartDataRow[] = mainChartData.map((dataRow) => {
                  const keys: string[] = Object.keys(dataRow)
                    .filter((key) => key.slice(1) !== year)
                    .filter((key) => key.slice(1) !== 'Data');
                  let newRowData: IChartDataRow = {
                    Data: dataRow.Data,
                  };
                  _.forEach(keys, (key) => {
                    newRowData[key as keyof IChartDataRow] = dataRow[key as keyof IChartDataRow];
                  });
                  return newRowData;
                });
                setMainChartData(newChartData);

                const [newBottom, newTop] = getAxisYDomain(
                  newChartData,
                  newChartData[0].Data,
                  newChartData[newChartData.length - 1].Data,
                  MAIN_UNIT,
                  1
                );
                setTop(newTop);
                setBottom(newBottom);

                const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
                  newChartData,
                  newChartData[0].Data,
                  newChartData[newChartData.length - 1].Data,
                  EVAPO_UNIT,
                  1
                );
                setTop_ET0(newTop_ET0);
                setBottom_ET0(newBottom_ET0);
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
          paddingTop: '3rem',
          paddingBottom: '10rem',
        }}
      >
        <Typography
          variant='h3'
          sx={{ margin: '0 auto' }}
        >
          Aplikacja do wizualizacji danych meteorologicznych dla miasta Bydgoszczy
        </Typography>
        <Typography
          variant='h4'
          sx={{
            color: '#fff',
            fontFamily: 'Inter',
            textAlign: 'left',
            padding: '0 3rem',
            marginBottom: '-2rem',
          }}
        >
          Średnia temperatura [°C]
        </Typography>
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
            onMouseUp={() =>
              zoom({
                unit: MAIN_UNIT,
                refAreaLeft,
                refAreaRight,
                refChartData: mainChartData,
                setLeft,
                setRight,
                setTop,
                setBottom,
                setRefAreaLeft,
                setRefAreaRight,
                setRefChartRef: setTempChartRef,
              })
            }
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
              dataKey={MAIN_UNIT}
              yAxisId={MAIN_UNIT}
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom as number, top as number]}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            {!_.isEmpty(mainChartData) &&
              Object.keys(mainChartData[0])
                .filter((key) => key !== 'Data' && _.startsWith(key, MAIN_UNIT))
                .map((key, idx) => {
                  return (
                    <Line
                      key={key}
                      type='monotone'
                      dataKey={key}
                      yAxisId={MAIN_UNIT}
                      stroke={TEMP_CHART_COLORS[idx]}
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
            <Legend />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                yAxisId={MAIN_UNIT}
                x1={refAreaLeft}
                x2={refAreaRight}
                fillOpacity={0.3}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
        <Typography
          variant='h4'
          sx={{
            color: '#fff',
            fontFamily: 'Inter',
            textAlign: 'left',
            padding: '0 3rem',
            marginTop: '3rem',
            marginBottom: '-2rem',
          }}
        >
          Ewapotranspiracja [mm]
        </Typography>
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <ComposedChart
            width={900}
            height={300}
            data={evapoChartRef}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseDown={(event) => {
              if (event && event.activeLabel) {
                setRefAreaLeft_ET0(event.activeLabel);
              }
            }}
            onMouseMove={(event) => {
              if (event && event.activeLabel && refAreaLeft_ET0 !== '') {
                setRefAreaRight_ET0(event.activeLabel);
              }
            }}
            onMouseUp={() =>
              zoom({
                unit: EVAPO_UNIT,
                refAreaLeft: refAreaLeft_ET0,
                refAreaRight: refAreaRight_ET0,
                refChartData: mainChartData,
                setLeft: setLeft_ET0,
                setRight: setRight_ET0,
                setTop: setTop_ET0,
                setBottom: setBottom_ET0,
                setRefAreaLeft: setRefAreaLeft_ET0,
                setRefAreaRight: setRefAreaRight_ET0,
                setRefChartRef: setEvapoChartRef,
              })
            }
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
              domain={[left_ET0, right_ET0]}
              tickCount={10}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            <YAxis
              dataKey={EVAPO_UNIT}
              yAxisId={EVAPO_UNIT}
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom_ET0 as number, top_ET0 as number]}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            {!_.isEmpty(mainChartData) &&
              Object.keys(mainChartData[0])
                .filter((key) => key !== 'Data' && _.startsWith(key, EVAPO_UNIT))
                .map((key, idx) => {
                  return (
                    <Line
                      key={key}
                      type='monotone'
                      dataKey={key}
                      yAxisId={EVAPO_UNIT}
                      stroke={EVAPO_CHART_COLORS[idx]}
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
            <Legend margin={{ bottom: 20 }} />
            {refAreaLeft_ET0 && refAreaRight_ET0 ? (
              <ReferenceArea
                yAxisId={EVAPO_UNIT}
                x1={refAreaLeft_ET0}
                x2={refAreaRight_ET0}
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

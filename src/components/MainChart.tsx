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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import _ from 'lodash';

import { setSelectedMonth, setSelectedTables } from '../features/table/tablesSlice';
import { setChartsProps, setMainChartData } from '../features/chart/chartsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain, zoom } from '../utils';
import CustomTooltip from './CustomTooltip';
import { getDbTable } from '../api';
import { TEMP_CHART_COLORS, MAIN_UNIT, EVAPO_UNIT, MONTHS, EVAPO_CHART_COLORS } from '../constants';
import SidePanel from './SidePanel';
import usePrevious from '../hooks/usePrevious';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const selectedTableNames: string[] = useAppSelector((state) => state.tables.selectedTableNames);
  const selectedTables: ITableRow[][] = useAppSelector((state) => state.tables.selectedTables);
  const selectedMonth: string = useAppSelector((state) => state.tables.selectedMonth);
  const chartsState = useAppSelector((state) => state.charts);

  const prevSelectedTableNames = usePrevious(selectedTableNames);

  useEffect(() => {
    _.forEach(selectedTableNames, (tableName) => {
      getDbTable(tableName)
        .then((newData: ITableRow[]) => {
          dispatch(setSelectedTables({ newTables: [...selectedTables, newData] }));
          const year: string = tableName.replace(/\D/g, '');
          const newChartData: IChartDataRow[] = newData.map((data) => ({
            Data: data.Data.slice(5),
            [`${MAIN_UNIT}${year}`]: data.T,
            [`${EVAPO_UNIT}${year}`]: data.ET0,
          }));
          console.log(newChartData);
          const [newBottom, newTop] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            MAIN_UNIT,
            1
          );
          const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            EVAPO_UNIT,
            1
          );
          // dispatch(
          //   setChartsProps({
          //     newProps: {
          //       ...chartsState,
          //       mainChartData: newChartData,
          //       tempChartRef: newChartData,
          //       evapoChartRef: newChartData,
          //       top: newTop,
          //       bottom: newBottom,
          //       top_ET0: newTop_ET0,
          //       bottom_ET0: newBottom_ET0,
          //     },
          //   })
          // );
          dispatch(
            setMainChartData({
              newData: newChartData,
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
    const newRefLeft: string = `${month !== 10 ? `0${month}` : month}-01`;
    const newRefRight: string = `${month !== 10 ? `0${month}` : month}-${daysInMonth}`;
    dispatch(
      setChartsProps({
        newProps: {
          ...chartsState,
          refAreaLeft: newRefLeft,
          refAreaRight: newRefRight,
          isManualRefArea: true,
          refAreaLeft_ET0: newRefLeft,
          refAreaRight_ET0: newRefRight,
          isManualRefArea_ET0: true,
        },
      })
    );
  }, [selectedMonth]);

  useEffect(() => {
    if (chartsState.isManualRefArea) {
      dispatch(setChartsProps({ newProps: { ...chartsState, isManualRefArea: false } }));
      // zoom({
      //   unit: MAIN_UNIT,
      //   refAreaLeft: refAreaLeft,
      //   refAreaRight: refAreaRight,
      //   refChartData: mainChartData,
      //   setLeft: setLeft,
      //   setRight: setRight,
      //   setTop: setTop,
      //   setBottom: setBottom,
      //   setRefAreaLeft: setRefAreaLeft,
      //   setRefAreaRight: setRefAreaRight,
      //   setRefChartRef: setTempChartRef,
      // });
    }
  }, [chartsState.isManualRefArea]);

  useEffect(() => {
    if (chartsState.isManualRefArea_ET0) {
      dispatch(setChartsProps({ newProps: { ...chartsState, isManualRefArea_ET0: false } }));
      // zoom({
      //   unit: EVAPO_UNIT,
      //   refAreaLeft: refAreaLeft_ET0,
      //   refAreaRight: refAreaRight_ET0,
      //   refChartData: mainChartData,
      //   setLeft: setLeft_ET0,
      //   setRight: setRight_ET0,
      //   setTop: setTop_ET0,
      //   setBottom: setBottom_ET0,
      //   setRefAreaLeft: setRefAreaLeft_ET0,
      //   setRefAreaRight: setRefAreaRight_ET0,
      //   setRefChartRef: setEvapoChartRef,
      // });
    }
  }, [chartsState.isManualRefArea_ET0]);

  useEffect(() => {
    console.log(selectedTableNames);
    if (_.isEmpty(selectedTableNames)) {
      dispatch(
        setChartsProps({
          newProps: { ...chartsState, top: null, bottom: null, top_ET0: null, bottom_ET0: null },
        })
      );
      dispatch(setSelectedTables({ newTables: [] }));
      return;
    }
    let addedChart: string[] = _.difference(selectedTableNames, prevSelectedTableNames as unknown as string[]);
    let deletedChart: string[] = _.difference(prevSelectedTableNames as unknown as string[], selectedTableNames);
    if (!_.isEmpty(addedChart)) {
      getDbTable(addedChart[0])
        .then((newData: ITableRow[]) => {
          dispatch(setSelectedTables({ newTables: [...selectedTables, newData] }));
          const year: string = addedChart[0].replace(/\D/g, '');
          const newChartData: IChartDataRow[] = newData.map((data, idx) => ({
            ...chartsState.mainChartData[idx],
            Data: data.Data.slice(5),
            [`${MAIN_UNIT}${year}`]: newData[idx].T,
            [`${EVAPO_UNIT}${year}`]: newData[idx].ET0,
          }));
          const [newBottom, newTop] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            MAIN_UNIT,
            1
          );
          const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            EVAPO_UNIT,
            1
          );
          // dispatch(
          //   setChartsProps({
          //     newProps: {
          //       ...chartsState,
          //       mainChartData: newChartData,
          //       tempChartRef: newChartData,
          //       top: newTop,
          //       bottom: newBottom,
          //       evapoChartRef: newChartData,
          //       top_ET0: newTop_ET0,
          //       bottom_ET0: newBottom_ET0,
          //     },
          //   })
          // );
          dispatch(
            setMainChartData({
              newData: newChartData,
            })
          );
          dispatch(setSelectedMonth({ newMonth: '' }));
        })
        .catch((error) => console.error(error));
    }
    // if (!_.isEmpty(deletedChart)) {
    //   const updatedTables: ITableRow[][] = selectedTables.filter(
    //     (table) => deletedChart[0].replace(/\D/g, '') !== table[0].Data.slice(0, 4)
    //   );
    //   dispatch(setSelectedTables({ newTables: updatedTables }));
    //   _.forEach(updatedTables, (updatedTable) => {
    //     const [newBottom, newTop] = getAxisYDomain(
    //       updatedTable,
    //       updatedTable[0].Data,
    //       updatedTable[updatedTable.length - 1].Data,
    //       MAIN_UNIT,
    //       1
    //     );
    //     const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
    //       updatedTable,
    //       updatedTable[0].Data,
    //       updatedTable[updatedTable.length - 1].Data,
    //       EVAPO_UNIT,
    //       1
    //     );
    //     dispatch(
    //       setChartsProps({
    //         newProps: {
    //           ...chartsState,
    //           top: newTop,
    //           bottom: newBottom,
    //           top_ET0: newTop_ET0,
    //           bottom_ET0: newBottom_ET0,
    //         },
    //       })
    //     );
    //   });
    //   const year: string = deletedChart[0].replace(/\D/g, '');
    //   let newChartData: IChartDataRow[] = chartsState.mainChartData.map((dataRow) => {
    //     const keys: string[] = Object.keys(dataRow)
    //       .filter((key) => key.slice(1) !== year)
    //       .filter((key) => key.slice(1) !== 'Data');
    //     let newRowData: IChartDataRow = {
    //       Data: dataRow.Data,
    //     };
    //     _.forEach(keys, (key) => {
    //       newRowData[key as keyof IChartDataRow] = dataRow[key as keyof IChartDataRow];
    //     });
    //     return newRowData;
    //   });
    //   const [newBottom, newTop] = getAxisYDomain(
    //     newChartData,
    //     newChartData[0].Data,
    //     newChartData[newChartData.length - 1].Data,
    //     MAIN_UNIT,
    //     1
    //   );
    //   const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
    //     newChartData,
    //     newChartData[0].Data,
    //     newChartData[newChartData.length - 1].Data,
    //     EVAPO_UNIT,
    //     1
    //   );
    //   dispatch(
    //     setChartsProps({
    //       newProps: {
    //         ...chartsState,
    //         mainChartData: newChartData,
    //         top: newTop,
    //         bottom: newBottom,
    //         top_ET0: newTop_ET0,
    //         bottom_ET0: newBottom_ET0,
    //       },
    //     })
    //   );
    // }
  }, [selectedTableNames]);

  useEffect(() => {
    console.log('mainChartData changed', chartsState.mainChartData[0]);
  }, [chartsState.mainChartData]);

  return (
    <Box id='main-window'>
      <SidePanel />
      <Box
        id='charts'
        sx={{
          width: 'calc(100% - 200px - 10rem)',
          maxWidth: 1400,
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
        <ResponsiveContainer height={300}>
          <ComposedChart
            width={900}
            height={300}
            data={chartsState.tempChartRef}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseDown={(event) => {
              if (event && event.activeLabel) {
                dispatch(setChartsProps({ newProps: { ...chartsState, refAreaLeft: event.activeLabel } }));
              }
            }}
            onMouseMove={(event) => {
              if (event && event.activeLabel && chartsState.refAreaLeft !== '') {
                dispatch(setChartsProps({ newProps: { ...chartsState, refAreaRight: event.activeLabel } }));
              }
            }}
            // onMouseUp={zoom}
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
              domain={[chartsState.left, chartsState.right]}
              tickCount={10}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            <YAxis
              dataKey={MAIN_UNIT}
              yAxisId={MAIN_UNIT}
              padding={{ bottom: 10, top: 10 }}
              domain={[chartsState.bottom as number, chartsState.top as number]}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            {!_.isEmpty(chartsState.mainChartData) &&
              Object.keys(chartsState.mainChartData[0])
                .filter((key) => key !== 'Data')
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
            {chartsState.refAreaLeft && chartsState.refAreaRight ? (
              <ReferenceArea
                yAxisId={MAIN_UNIT}
                x1={chartsState.refAreaLeft}
                x2={chartsState.refAreaRight}
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
        <ResponsiveContainer height={300}>
          <ComposedChart
            width={900}
            height={300}
            data={chartsState.evapoChartRef}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseDown={(event) => {
              if (event && event.activeLabel) {
                dispatch(setChartsProps({ newProps: { ...chartsState, refAreaLeft_ET0: event.activeLabel } }));
              }
            }}
            onMouseMove={(event) => {
              if (event && event.activeLabel && chartsState.refAreaLeft_ET0 !== '') {
                dispatch(setChartsProps({ newProps: { ...chartsState, refAreaRight_ET0: event.activeLabel } }));
              }
            }}
            onMouseUp={
              () => null
              // zoom({
              //   unit: EVAPO_UNIT,
              //   refAreaLeft: refAreaLeft_ET0,
              //   refAreaRight: refAreaRight_ET0,
              //   refChartData: mainChartData,
              //   setLeft: setLeft_ET0,
              //   setRight: setRight_ET0,
              //   setTop: setTop_ET0,
              //   setBottom: setBottom_ET0,
              //   setRefAreaLeft: setRefAreaLeft_ET0,
              //   setRefAreaRight: setRefAreaRight_ET0,
              //   setRefChartRef: setEvapoChartRef,
              // })
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
              domain={[chartsState.left_ET0, chartsState.right_ET0]}
              tickCount={10}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            <YAxis
              dataKey={EVAPO_UNIT}
              yAxisId={EVAPO_UNIT}
              padding={{ bottom: 10, top: 10 }}
              domain={[chartsState.bottom_ET0 as number, chartsState.top_ET0 as number]}
              tick={{ fill: '#00000080' }}
              tickLine={{ stroke: '#00000050' }}
            />
            {!_.isEmpty(chartsState.mainChartData) &&
              Object.keys(chartsState.mainChartData[0])
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
            {chartsState.refAreaLeft_ET0 && chartsState.refAreaRight_ET0 ? (
              <ReferenceArea
                yAxisId={EVAPO_UNIT}
                x1={chartsState.refAreaLeft_ET0}
                x2={chartsState.refAreaRight_ET0}
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

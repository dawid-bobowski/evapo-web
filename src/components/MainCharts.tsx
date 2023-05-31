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
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import _ from 'lodash';

import { setSelectedMonth, setSelectedTables } from '../features/table/tablesSlice';
import { setChartsProps } from '../features/chart/chartsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getAxisYDomain } from '../utils';
import CustomTooltip from './CustomTooltip';
import { getDbTable } from '../api';
import { TEMP_CHART_COLORS, TEMP_UNIT, EVAPO_UNIT, MONTHS, EVAPO_CHART_COLORS } from '../constants';
import SidePanel from './SidePanel';
import usePrevious from '../hooks/usePrevious';
import logo from '../assets/logo-ukw.jpg';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const selectedTableNames: string[] = useAppSelector((state) => state.tables.selectedTableNames);
  const selectedTables: ITableRow[][] = useAppSelector((state) => state.tables.selectedTables);
  const chartsState: ChartsState = useAppSelector((state) => state.charts);
  const prevSelectedTableNames = usePrevious(selectedTableNames);

  /**
   * Zooms in the tables.
   */
  const zoom = (temp: boolean, evapo: boolean) => {
    const { refAreaLeft, refAreaRight, refAreaLeft_ET0, refAreaRight_ET0, mainChartData, top, bottom } = chartsState;
    if (temp && (refAreaLeft === refAreaRight || refAreaLeft === '' || refAreaRight === '')) {
      dispatch(
        setChartsProps({
          newProps: {
            ...chartsState,
            refAreaLeft: '',
            refAreaRight: '',
          },
        })
      );
      return;
    }
    let refLeft: string = refAreaLeft;
    let refRight: string = refAreaRight;
    let refAreaLeftIndex: number = _.indexOf(
      mainChartData,
      mainChartData.find((el) => el.Data === refAreaLeft)
    );
    let refAreaRightIndex: number = _.indexOf(
      mainChartData,
      mainChartData.find((el) => el.Data === refAreaRight)
    );
    let newTop: number | null = top;
    let newBottom: number | null = bottom;
    if (temp) {
      // xAxis domain
      if (refAreaLeftIndex > refAreaRightIndex) {
        refRight = [refLeft, (refLeft = refRight)][0];
        refAreaRightIndex = [refAreaLeftIndex, (refAreaLeftIndex = refAreaRightIndex)][0];
      }
      if (refLeft === '' || refRight === '') return;
      // yAxis domain
      [newBottom, newTop] = getAxisYDomain(mainChartData, refLeft, refRight, TEMP_UNIT, 1);
      if (!evapo) {
        dispatch(
          setChartsProps({
            newProps: {
              ...chartsState,
              tempChartRef: mainChartData.slice(refAreaLeftIndex, refAreaRightIndex + 1),
              refAreaLeft: '',
              refAreaRight: '',
              left: refLeft,
              right: refRight,
              top: newTop,
              bottom: newBottom,
            },
          })
        );
      }
    }

    if (evapo) {
      if (!temp && (refAreaLeft_ET0 === refAreaRight_ET0 || refAreaLeft_ET0 === '' || refAreaRight_ET0 === '')) {
        dispatch(
          setChartsProps({
            newProps: {
              ...chartsState,
              refAreaLeft_ET0: '',
              refAreaRight_ET0: '',
            },
          })
        );
        return;
      }
      // xAxis domain
      let refLeft_ET0 = refAreaLeft_ET0;
      let refRight_ET0 = refAreaRight_ET0;
      let refAreaLeftIndex_ET0 = _.indexOf(
        mainChartData,
        mainChartData.find((el) => el.Data === refAreaLeft_ET0)
      );
      let refAreaRightIndex_ET0 = _.indexOf(
        mainChartData,
        mainChartData.find((el) => el.Data === refAreaRight_ET0)
      );
      if (refAreaLeftIndex_ET0 > refAreaRightIndex_ET0) {
        refRight_ET0 = [refLeft_ET0, (refLeft_ET0 = refRight_ET0)][0];
        refAreaRightIndex_ET0 = [refAreaLeftIndex_ET0, (refAreaLeftIndex_ET0 = refAreaRightIndex_ET0)][0];
      }
      if (refLeft_ET0 === '' || refRight_ET0 === '') return;
      // yAxis domain
      const [newBottom_ET0, newTop_ET0] = getAxisYDomain(mainChartData, refLeft_ET0, refRight_ET0, EVAPO_UNIT, 1);
      dispatch(
        setChartsProps({
          newProps: {
            ...chartsState,
            tempChartRef: temp
              ? mainChartData.slice(refAreaLeftIndex, refAreaRightIndex + 1)
              : chartsState.tempChartRef,
            refAreaLeft: temp ? '' : chartsState.refAreaLeft,
            refAreaRight: temp ? '' : chartsState.refAreaRight,
            left: temp ? refLeft : chartsState.left,
            right: temp ? refRight : chartsState.right,
            top: temp ? newTop : chartsState.top,
            bottom: temp ? newBottom : chartsState.bottom,
            evapoChartRef: mainChartData.slice(refAreaLeftIndex_ET0, refAreaRightIndex_ET0 + 1),
            refAreaLeft_ET0: '',
            refAreaRight_ET0: '',
            left_ET0: refLeft_ET0,
            right_ET0: refRight_ET0,
            top_ET0: newTop_ET0,
            bottom_ET0: newBottom_ET0,
            wasMonthSelected: false,
          },
        })
      );
    }
  };

  useEffect(() => {
    _.forEach(selectedTableNames, (tableName) => {
      getDbTable(tableName)
        .then((newData: ITableRow[]) => {
          dispatch(setSelectedTables({ newTables: [...selectedTables, newData] }));
          const year: string = tableName.replace(/\D/g, '');
          const newChartData: IChartDataRow[] = newData.map((data) => ({
            Data: data.Data.slice(5),
            [`${TEMP_UNIT}${year}`]: data.T,
            [`${EVAPO_UNIT}${year}`]: data.ET0,
          }));
          const [newBottom, newTop] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            TEMP_UNIT,
            1
          );
          const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            EVAPO_UNIT,
            1
          );
          dispatch(
            setChartsProps({
              newProps: {
                ...chartsState,
                mainChartData: newChartData,
                tempChartRef: newChartData,
                evapoChartRef: newChartData,
                top: newTop,
                bottom: newBottom,
                top_ET0: newTop_ET0,
                bottom_ET0: newBottom_ET0,
              },
            })
          );
        })
        .catch((error) => console.error(error));
    });
  }, []);

  useEffect(() => {
    if (!chartsState.wasMonthSelected) return;
    zoom(true, true);
  }, [chartsState.wasMonthSelected]);

  useEffect(() => {
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
            [`${TEMP_UNIT}${year}`]: newData[idx].T,
            [`${EVAPO_UNIT}${year}`]: newData[idx].ET0,
          }));
          const [newBottom, newTop] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            TEMP_UNIT,
            1
          );
          const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
            newChartData,
            newChartData[0].Data,
            newChartData[newChartData.length - 1].Data,
            EVAPO_UNIT,
            1
          );
          dispatch(
            setChartsProps({
              newProps: {
                ...chartsState,
                mainChartData: newChartData,
                tempChartRef: newChartData,
                top: newTop,
                bottom: newBottom,
                evapoChartRef: newChartData,
                top_ET0: newTop_ET0,
                bottom_ET0: newBottom_ET0,
              },
            })
          );
          dispatch(setSelectedMonth({ newMonth: '' }));
        })
        .catch((error) => console.error(error));
    }
    if (!_.isEmpty(deletedChart)) {
      const updatedTables: ITableRow[][] = selectedTables.filter(
        (table) => deletedChart[0].slice(4, 8) !== table[0].Data.slice(0, 4)
      );
      dispatch(setSelectedTables({ newTables: updatedTables }));
      const year: string = deletedChart[0].replace(/\D/g, '');
      let newChartData: IChartDataRow[] = chartsState.mainChartData.map((dataRow) => {
        const keys: string[] = Object.keys(dataRow)
          .filter((key) => key.slice(-4) !== year)
          .filter((key) => key !== 'Data');
        let newRowData: IChartDataRow = {
          Data: dataRow.Data,
        };
        _.forEach(keys, (key) => {
          newRowData[key as keyof IChartDataRow] = dataRow[key as keyof IChartDataRow];
        });
        return newRowData;
      });
      const [newBottom, newTop] = getAxisYDomain(
        newChartData,
        newChartData[0].Data,
        newChartData[newChartData.length - 1].Data,
        TEMP_UNIT,
        1
      );
      const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
        newChartData,
        newChartData[0].Data,
        newChartData[newChartData.length - 1].Data,
        EVAPO_UNIT,
        1
      );
      dispatch(
        setChartsProps({
          newProps: {
            ...chartsState,
            mainChartData: newChartData,
            tempChartRef: newChartData,
            evapoChartRef: newChartData,
            top: newTop,
            bottom: newBottom,
            top_ET0: newTop_ET0,
            bottom_ET0: newBottom_ET0,
          },
        })
      );
    }
  }, [selectedTableNames]);

  return (
    <Box
      id='main-window'
      sx={{
        display: 'flex',
        marginLeft: 'calc(200px + 4rem)',
      }}
    >
      <SidePanel />
      <Box
        sx={{
          width: 'calc(100% - 3rem)',
          height: '4rem',
          backgroundColor: '#fff',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '-34px 9px 11px -13px rgba(66, 68, 90, 1)',
          padding: '0 2rem 0 1rem',
          zIndex: 10,
        }}
      >
        <Avatar
          alt='Logo UKW'
          src={logo}
        />
        <Typography
          variant='h2'
          sx={{ color: '#000', fontSize: '1.2rem' }}
        >
          Aplikacja do wizualizacji danych meteorologicznych dla miasta Bydgoszczy
        </Typography>
      </Box>
      <Box
        id='charts'
        sx={{
          width: 'calc(100% - 200px)',
          maxWidth: 1400,
          minHeight: 'calc(100vh - 10rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
          margin: '0 auto',
          paddingTop: '4rem',
          paddingBottom: '6rem',
        }}
      >
        <Typography
          variant='h4'
          sx={{
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'left',
            marginTop: '2rem',
            marginBottom: '-2rem',
          }}
        >
          Średnia temperatura [°C]
        </Typography>
        <Box>
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
              onMouseUp={() => zoom(true, false)}
              style={{
                backgroundColor: '#fff',
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
                dataKey={TEMP_UNIT}
                yAxisId={TEMP_UNIT}
                padding={{ bottom: 10, top: 10 }}
                domain={[chartsState.bottom as number, chartsState.top as number]}
                tick={{ fill: '#00000080' }}
                tickLine={{ stroke: '#00000050' }}
              />
              {!_.isEmpty(chartsState.tempChartRef) &&
                Object.keys(chartsState.tempChartRef[0])
                  .filter((key) => key !== 'Data' && _.startsWith(key, TEMP_UNIT))
                  .map((key, idx) => {
                    return (
                      <Line
                        key={key}
                        type='monotone'
                        dataKey={key}
                        yAxisId={TEMP_UNIT}
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
              <Legend wrapperStyle={{ margin: 10, fontWeight: 'bold' }} />
              {chartsState.refAreaLeft && chartsState.refAreaRight ? (
                <ReferenceArea
                  yAxisId={TEMP_UNIT}
                  x1={chartsState.refAreaLeft}
                  x2={chartsState.refAreaRight}
                  fillOpacity={0.3}
                />
              ) : null}
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
        <Typography
          variant='h4'
          sx={{
            color: '#fff',
            fontSize: '1.2rem',
            textAlign: 'left',
            marginTop: '3rem',
            marginBottom: '-2rem',
          }}
        >
          Ewapotranspiracja [mm]
        </Typography>
        <Box>
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
              onMouseUp={() => zoom(false, true)}
              style={{
                backgroundColor: '#fff',
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
              {!_.isEmpty(chartsState.evapoChartRef) &&
                Object.keys(chartsState.evapoChartRef[0])
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
              <Legend wrapperStyle={{ margin: 10, fontWeight: 'bold' }} />
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
    </Box>
  );
};

export default MainChart;

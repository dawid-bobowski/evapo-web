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
import { SelectChangeEvent } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';

import { setSelectedTableName1, setSelectedTableName2, setTable1, setTable2 } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { convertDate, getAxisYDomain, setRefTables } from '../utils';
import CustomTooltip from './CustomTooltip';
import TableSelect from './TableSelect';
import { getDbTable } from '../api';

const MainChart = () => {
  const dispatch = useAppDispatch();
  const selectedTableName1: string = useAppSelector((state) => state.tables.selectedTableName1);
  const selectedTableName2: string = useAppSelector((state) => state.tables.selectedTableName2);
  const [currentTable1, setCurrentTable1] = useState<ITableRow[]>([]);
  const [currentTable2, setCurrentTable2] = useState<ITableRow[]>([]);
  const [refTable1, setRefTable1] = useState<ITableRow[]>([]);
  const [refTable2, setRefTable2] = useState<ITableRow[]>([]);
  const [refAreaLeft, setRefAreaLeft] = useState<string>('');
  const [refAreaRight, setRefAreaRight] = useState<string>('');
  const [left, setLeft] = useState<string>('');
  const [right, setRight] = useState<string>('');
  const [top, setTop] = useState<number | string>('');
  const [bottom, setBottom] = useState<number | string>('');

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
    if (refAreaLeft === refAreaRight || refAreaRight === '') {
      setRefAreaLeft('');
      setRefAreaRight('');
      return;
    }

    // xAxis domain
    let refLeft = refAreaLeft;
    let refRight = refAreaRight;
    let refAreaLeftIndex = _.indexOf(
      currentTable1,
      currentTable1.find((el) => el.date === refAreaLeft)
    );
    let refAreaRightIndex = _.indexOf(
      currentTable1,
      currentTable1.find((el) => el.date === refAreaRight)
    );

    if (refAreaLeftIndex > refAreaRightIndex) {
      refRight = [refLeft, (refLeft = refRight)][0];
      refAreaRightIndex = [refAreaLeftIndex, (refAreaLeftIndex = refAreaRightIndex)][0];
    }

    // yAxis domain
    const [newBottom, newTop] = getAxisYDomain(currentTable1, refLeft, refRight, 'T', 1);

    setRefTable1(currentTable1.slice(refAreaLeftIndex, refAreaRightIndex + 1));
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
  const resetZoom = () => {
    setRefTables({
      currentTable1,
      currentTable2,
      setLeft,
      setRight,
      setTop,
      setBottom,
      setRefTable1,
      setRefTable2,
    });
  };

  useEffect(() => {
    getDbTable(selectedTableName1)
      .then((newData: ITableRow[]) => {
        const [newBottom, newTop] = getAxisYDomain(newData, newData[0].date, newData[newData.length - 1].date, 'T', 1);
        setTop(newTop);
        setBottom(newBottom);
        dispatch(setTable1({ newTable: newData }));
        setCurrentTable1(newData);
        setRefTable1(newData);
      })
      .catch((error) => console.error(error));
  }, [selectedTableName1]);

  useEffect(() => {
    getDbTable(selectedTableName2)
      .then((newData: ITableRow[]) => {
        const [newBottom, newTop] = getAxisYDomain(newData, newData[0].date, newData[newData.length - 1].date, 'T', 1);
        setTop(newTop);
        setBottom(newBottom);
        dispatch(setTable2({ newTable: newData }));
        setCurrentTable2(newData);
        setRefTable2(newData);
      })
      .catch((error) => console.error(error));
  }, [selectedTableName2]);

  useEffect(() => {
    setRefTables({
      currentTable1,
      currentTable2,
      setLeft,
      setRight,
      setTop,
      setBottom,
      setRefTable1,
      setRefTable2,
    });
  }, [currentTable1, currentTable2]);

  return (
    <div id='table'>
      <Card
        variant='outlined'
        sx={{
          padding: '3rem 4rem 3rem 1rem',
        }}
      >
        <Box style={{ width: 1100, marginLeft: '5rem', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
          <TableSelect
            label='Tabela 1'
            tableName={selectedTableName1}
            onChange={(event: SelectChangeEvent) =>
              handleChange({ event, setSelectedTableName: setSelectedTableName1, setTable: setTable1 })
            }
          />
          <TableSelect
            label='Tabela 2'
            tableName={selectedTableName2}
            onChange={(event: SelectChangeEvent) =>
              handleChange({ event, setSelectedTableName: setSelectedTableName2, setTable: setTable2 })
            }
          />
          <Button
            onClick={resetZoom}
            sx={{
              width: 80,
              lineHeight: 1.5,
              fontWeight: 'bold',
              height: '2.5rem',
              alignSelf: 'flex-start',
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
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <ComposedChart
            syncId='tables'
            width={1100}
            height={300}
            data={refTable1}
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
                  stopColor='#002d80'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#002d80'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              horizontalPoints={[5, 80, 160]}
            />
            <XAxis
              dataKey='date'
              padding='gap'
              domain={[left, right]}
              label={{ value: 'Dzień', position: 'insideBottomRight', offset: -20 }}
              tickFormatter={(value: string) => convertDate(value)}
              tickCount={10}
            />
            <YAxis
              dataKey='T'
              yAxisId='T'
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom, top]}
              label={{ value: 'Temperatura', angle: -90, position: 'left' }}
            />
            <YAxis
              dataKey='Et0'
              yAxisId='Et0'
              orientation='right'
              padding={{ bottom: 10, top: 10 }}
              domain={[0, 8000]}
              label={{ value: 'Ewapotranspiracja', angle: 90, position: 'right' }}
            />
            <Area
              type='monotone'
              dataKey='Et0'
              yAxisId='Et0'
              stroke='#002d80'
              fillOpacity={0.8}
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
            <Legend
              payload={[
                { value: 'T [°C]', color: '#2fc4ff', type: 'line' },
                { value: 'Et0 [mm^3]', color: '#002d80', type: 'line' },
              ]}
            />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
        <ResponsiveContainer
          width='100%'
          height={300}
        >
          <ComposedChart
            syncId='tables'
            width={1100}
            height={300}
            data={refTable2}
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
            <defs>
              <linearGradient
                id='colorT'
                x1='0'
                y1='0'
                x2='0'
                y2='1'
              >
                <stop
                  offset='5%'
                  stopColor='#008064'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='#008064'
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray='3 3'
              horizontalPoints={[5, 80, 160]}
            />
            <XAxis
              dataKey='date'
              padding='gap'
              domain={[left, right]}
              label={{ value: 'Dzień', position: 'insideBottomRight', offset: -20 }}
              tickFormatter={(value: string) => convertDate(value)}
              tickCount={10}
            />
            <YAxis
              dataKey='T'
              yAxisId='T'
              padding={{ bottom: 10, top: 10 }}
              domain={[bottom, top]}
              label={{ value: 'Temperatura', angle: -90, position: 'left' }}
            />
            <YAxis
              dataKey='Et0'
              yAxisId='Et0'
              orientation='right'
              padding={{ bottom: 10, top: 10 }}
              domain={[0, 8000]}
              label={{ value: 'Ewapotranspiracja', angle: 90, position: 'right' }}
            />
            <Area
              type='monotone'
              dataKey='Et0'
              yAxisId='Et0'
              stroke='#008064'
              fillOpacity={0.8}
              fill='url(#colorT)'
              animationDuration={300}
              dot={false}
            />
            <Line
              type='monotone'
              dataKey='T'
              yAxisId='T'
              stroke='#2be2a5'
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
            <Legend
              payload={[
                { value: 'T [°C]', color: '#2be2a5', type: 'line' },
                { value: 'Et0 [mm^3]', color: '#008064', type: 'line' },
              ]}
            />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MainChart;

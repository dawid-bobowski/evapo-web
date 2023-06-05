import _ from 'lodash';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';

import { setSelectedMonth, setSelectedTableNames } from '../features/table/tablesSlice';
import { DB_NAMES, EVAPO_UNIT, TEMP_UNIT, MONTHS } from '../constants';
import { createTextFile, getAxisYDomain } from '../utils';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setChartsProps } from '../features/chart/chartsSlice';
import { useEffect } from 'react';

const SidePanel = () => {
  const dispatch = useAppDispatch();
  const selectedChartNames = useAppSelector((state) => state.tables.selectedTableNames);
  const selectedMonth = useAppSelector((state) => state.tables.selectedMonth);
  const chartsState = useAppSelector((state) => state.charts);

  /**
   * Resets zoom on both tables.
   */
  const resetZoom = () => {
    const [newBottom, newTop] = getAxisYDomain(
      chartsState.mainChartData,
      chartsState.mainChartData[0].Data,
      chartsState.mainChartData[chartsState.mainChartData.length - 1].Data,
      TEMP_UNIT,
      1
    );
    const [newBottom_ET0, newTop_ET0] = getAxisYDomain(
      chartsState.mainChartData,
      chartsState.mainChartData[0].Data,
      chartsState.mainChartData[chartsState.mainChartData.length - 1].Data,
      EVAPO_UNIT,
      1
    );

    dispatch(
      setChartsProps({
        newProps: {
          ...chartsState,
          tempChartRef: chartsState.mainChartData,
          top: newTop,
          bottom: newBottom,
          left: chartsState.mainChartData[0].Data,
          right: chartsState.mainChartData[chartsState.mainChartData.length - 1].Data,
          refAreaLeft: '',
          refAreaRight: '',
          evapoChartRef: chartsState.mainChartData,
          top_ET0: newTop_ET0,
          bottom_ET0: newBottom_ET0,
          left_ET0: chartsState.mainChartData[0].Data,
          right_ET0: chartsState.mainChartData[chartsState.mainChartData.length - 1].Data,
          refAreaLeft_ET0: '',
          refAreaRight_ET0: '',
        },
      })
    );

    dispatch(setSelectedMonth({ newMonth: '' }));
  };

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
          refAreaLeft_ET0: newRefLeft,
          refAreaRight_ET0: newRefRight,
          wasMonthSelected: true,
        },
      })
    );
  }, [selectedMonth]);

  return (
    <Box
      id='menu'
      sx={{
        width: '200px',
        height: 'calc(100vh - 10rem)',
        padding: '7rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: '#f1f1f1',
        position: 'fixed',
        left: 0,
        top: 0,
      }}
    >
      <Box>
        <FormLabel>Wybierz max 5 roczników:</FormLabel>
        <FormControl
          size='small'
          sx={{
            marginBottom: '2rem',
            width: 160,
            backgroundColor: '#fff',
          }}
        >
          <Select
            multiple
            value={selectedChartNames}
            onChange={(event: SelectChangeEvent<string[]>) => {
              if (typeof event.target.value === 'string' || event.target.value.length > 5) {
                return;
              }
              dispatch(setSelectedTableNames({ newNames: event.target.value }));
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
            backgroundColor: '#fff',
          }}
        >
          <Select
            value={selectedMonth}
            onChange={(event: SelectChangeEvent<string>) => {
              dispatch(setSelectedMonth({ newMonth: event.target.value }));
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
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            onClick={resetZoom}
            sx={{
              width: 80,
              lineHeight: 1.5,
              fontWeight: 'bold',
              height: '2.5rem',
              color: '#002d80',
              backgroundColor: '#fff',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              textTransform: 'capitalize',
              '&:hover': {
                border: '1px solid rgba(0, 0, 0, 0.87)',
                backgroundColor: '#fff',
              },
            }}
          >
            Reset
          </Button>
          <Button
            onClick={() => createTextFile(chartsState.tempChartRef, selectedChartNames, chartsState.left, chartsState.right)}
            sx={{
              width: 120,
              lineHeight: 1.5,
              fontWeight: 'bold',
              height: '2.5rem',
              color: '#002d80',
              backgroundColor: '#fff',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              textTransform: 'capitalize',
              '&:hover': {
                border: '1px solid rgba(0, 0, 0, 0.87)',
                backgroundColor: '#fff',
              },
            }}
            >
            Pobierz T
          </Button>
          <Button
            onClick={() => createTextFile(chartsState.evapoChartRef, selectedChartNames, chartsState.left_ET0, chartsState.right_ET0)}
            sx={{
              width: 120,
              lineHeight: 1.5,
              fontWeight: 'bold',
              height: '2.5rem',
              color: '#002d80',
              backgroundColor: '#fff',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              textTransform: 'capitalize',
              '&:hover': {
                border: '1px solid rgba(0, 0, 0, 0.87)',
                backgroundColor: '#fff',
              },
            }}
            >
            Pobierz ET0
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant='caption'
          sx={{ color: 'rgba(0, 0, 0, 0.8)' }}
        >
          Dawid Bobowski
        </Typography>
        <Typography
          variant='caption'
          sx={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '10px' }}
        >
          nr indeksu: 95213
        </Typography>
      </Box>
    </Box>
  );
};

export default SidePanel;

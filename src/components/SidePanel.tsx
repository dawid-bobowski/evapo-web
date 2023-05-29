import _ from 'lodash';
import { Box, Button, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

import { setSelectedMonth, setSelectedTableNames, setSelectedTables } from '../features/table/tablesSlice';
import { getDbTable } from '../api';
import { DB_NAMES, EVAPO_UNIT, MAIN_UNIT, MONTHS } from '../constants';
import { getAxisYDomain } from '../utils';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setChartsProps } from '../features/chart/chartsSlice';

const SidePanel = () => {
  const dispatch = useAppDispatch();
  const selectedChartNames = useAppSelector((state) => state.tables.selectedTableNames);
  const selectedCharts = useAppSelector((state) => state.tables.selectedTables);
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
      MAIN_UNIT,
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

  return (
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
            if (typeof event.target.value === 'string' || event.target.value.length > 3) {
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
  );
};

export default SidePanel;

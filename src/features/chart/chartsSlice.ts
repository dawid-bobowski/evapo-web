import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChartsState = {
  mainChartData: [],
  tempChartRef: [],
  evapoChartRef: [],
  isManualRefArea: false,
  isManualRefArea_ET0: false,
  refAreaLeft: '',
  refAreaLeft_ET0: '',
  refAreaRight: '',
  refAreaRight_ET0: '',
  left: '',
  left_ET0: '',
  right: '',
  right_ET0: '',
  top: null,
  top_ET0: null,
  bottom: null,
  bottom_ET0: null,
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setChartsProps(state, action: PayloadAction<{ newProps: ChartsState }>) {
      state = action.payload.newProps;
    },
    setMainChartData(state, action: PayloadAction<{ newData: IChartDataRow[] }>) {
      state.mainChartData = action.payload.newData;
    },
  },
});

export const { setChartsProps, setMainChartData } = chartsSlice.actions;
export default chartsSlice.reducer;

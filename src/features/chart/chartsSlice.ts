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
      const {
        mainChartData,
        tempChartRef,
        evapoChartRef,
        isManualRefArea,
        isManualRefArea_ET0,
        refAreaLeft,
        refAreaLeft_ET0,
        refAreaRight,
        refAreaRight_ET0,
        left,
        left_ET0,
        right,
        right_ET0,
        top,
        top_ET0,
        bottom,
        bottom_ET0,
      } = action.payload.newProps;

      state.mainChartData = mainChartData;
      state.tempChartRef = tempChartRef;
      state.evapoChartRef = evapoChartRef;
      state.isManualRefArea = isManualRefArea;
      state.isManualRefArea_ET0 = isManualRefArea_ET0;
      state.refAreaLeft = refAreaLeft;
      state.refAreaLeft_ET0 = refAreaLeft_ET0;
      state.refAreaRight = refAreaRight;
      state.refAreaRight_ET0 = refAreaRight_ET0;
      state.left = left;
      state.left_ET0 = left_ET0;
      state.right = right;
      state.right_ET0 = right_ET0;
      state.top = top;
      state.top_ET0 = top_ET0;
      state.bottom = bottom;
      state.bottom_ET0 = bottom_ET0;
    },
  },
});

export const { setChartsProps } = chartsSlice.actions;
export default chartsSlice.reducer;

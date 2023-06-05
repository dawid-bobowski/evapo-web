import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChartsState = {
  mainChartData: [],
  tempChartRef: [],
  evapoChartRef: [],
  precChartRef: [],
  wasMonthSelected: false,
  refAreaLeft: '',
  refAreaLeft_ET0: '',
  refAreaLeft_P: '',
  refAreaRight: '',
  refAreaRight_ET0: '',
  refAreaRight_P: '',
  left: '',
  left_ET0: '',
  left_P: '',
  right: '',
  right_ET0: '',
  right_P: '',
  top: null,
  top_ET0: null,
  top_P: null,
  bottom: null,
  bottom_ET0: null,
  bottom_P: null,
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
        precChartRef,
        wasMonthSelected,
        refAreaLeft,
        refAreaLeft_ET0,
        refAreaLeft_P,
        refAreaRight,
        refAreaRight_ET0,
        refAreaRight_P,
        left,
        left_ET0,
        left_P,
        right,
        right_ET0,
        right_P,
        top,
        top_ET0,
        top_P,
        bottom,
        bottom_ET0,
        bottom_P,
      } = action.payload.newProps;

      state.mainChartData = mainChartData;
      state.tempChartRef = tempChartRef;
      state.evapoChartRef = evapoChartRef;
      state.precChartRef = precChartRef;
      state.wasMonthSelected = wasMonthSelected;
      state.refAreaLeft = refAreaLeft;
      state.refAreaLeft_ET0 = refAreaLeft_ET0;
      state.refAreaLeft_P = refAreaLeft_P;
      state.refAreaRight = refAreaRight;
      state.refAreaRight_ET0 = refAreaRight_ET0;
      state.refAreaRight_P = refAreaRight_P;
      state.left = left;
      state.left_ET0 = left_ET0;
      state.left_P = left_P;
      state.right = right;
      state.right_ET0 = right_ET0;
      state.right_P = right_P;
      state.top = top;
      state.top_ET0 = top_ET0;
      state.top_P = top_P;
      state.bottom = bottom;
      state.bottom_ET0 = bottom_ET0;
      state.bottom_P = bottom_P;
    },
  },
});

export const { setChartsProps } = chartsSlice.actions;
export default chartsSlice.reducer;

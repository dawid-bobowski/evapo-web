import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';
import _ from 'lodash';

const unit: { [key: string]: string } = {
  T: '°C',
  ET0: 'mm',
  P: 'mm',
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {label}
        </p>
        {payload.map((data) => {
          const activeUnit: string = (data.dataKey as string).slice(0, -4);
          return (
            <p key={data.dataKey}>
              <span style={{ fontWeight: 'bold' }}>{data.dataKey as string}: </span>
              {data.payload[data.dataKey as string]} {unit[activeUnit]}
            </p>
          );
        })}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';
import _ from 'lodash';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {label}
        </p>
        {payload.map((data) => (
          <p key={data.dataKey}>
            <span style={{ fontWeight: 'bold' }}>{(data.dataKey as string).slice(1)}: </span>
            {data.payload[data.dataKey as string]} °C
          </p>
        ))}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

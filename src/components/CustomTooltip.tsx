import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';

import { convertDate } from '../utils';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {convertDate(label)}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Temperatura: </span>
          {payload[0].value}
        </p>
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

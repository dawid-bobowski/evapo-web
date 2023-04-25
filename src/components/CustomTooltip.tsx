import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';

import { convertDate } from '../utils';
import _ from 'lodash';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {convertDate(label)}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>T: </span>
          {payload[0].value}
        </p>
        {payload[1] && (
          <p>
            <span style={{ fontWeight: 'bold' }}>Et0: </span>
            {_.round(payload[1].value as number)}
          </p>
        )}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';

import { convertDate } from '../utils';
import _ from 'lodash';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const T: Payload<ValueType, NameType> | undefined = payload.find((field) => field.name === 'T');
    const Et0: Payload<ValueType, NameType> | undefined = payload.find((field) => field.name === 'Et0');
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {convertDate(label)}
        </p>
        {T && (
          <p>
            <span style={{ fontWeight: 'bold' }}>T: </span>
            {T.value}
          </p>
        )}
        {Et0 && (
          <p>
            <span style={{ fontWeight: 'bold' }}>Et0: </span>
            {_.round(Et0.value as number)}
          </p>
        )}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

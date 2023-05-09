import { NameType, Payload, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';
import _ from 'lodash';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const T: Payload<ValueType, NameType> | undefined = payload.find((field) => field.name === 'T');
    const ET0: Payload<ValueType, NameType> | undefined = payload.find((field) => field.name === 'ET0');
    return (
      <Box className='custom-tooltip'>
        <p>
          <span style={{ fontWeight: 'bold' }}>Dzień: </span>
          {label}
        </p>
        {T && (
          <p>
            <span style={{ fontWeight: 'bold' }}>T: </span>
            {T.value} °C
          </p>
        )}
        {ET0 && (
          <p>
            <span style={{ fontWeight: 'bold' }}>ET0: </span>
            {ET0.value} mm
          </p>
        )}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps } from 'recharts';
import { Box } from '@mui/material';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box className='custom-tooltip'>
        <p>{`Dzień: ${label}`}</p>
        <p>{`Temperatura: ${payload[0].value}`}</p>
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;

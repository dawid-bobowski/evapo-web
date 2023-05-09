import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { DB_NAMES } from '../constants';

interface ITableSelectProps {
  label: string;
  tableName: string;
  onChange: (event: SelectChangeEvent) => void;
}

const TableSelect = (props: ITableSelectProps) => {
  return (
    <FormControl
      id='table-form-control'
      size='small'
      sx={{
        marginBottom: '2rem',
      }}
    >
      <InputLabel id='table-select-label'>{props.label}</InputLabel>
      <Select
        labelId='table-select-label'
        id='table-select'
        label='table'
        value={props.tableName}
        onChange={props.onChange}
      >
        {DB_NAMES.map((dbName) => (
          <MenuItem
            key={dbName}
            value={dbName}
          >
            {dbName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TableSelect;

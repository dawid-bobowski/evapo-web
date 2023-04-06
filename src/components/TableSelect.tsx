import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setSelectedTableName } from '../features/table/tableSlice';
import { DB_NAMES } from '../constants';

const TableSelect = () => {
  const dispatch = useAppDispatch();
  const selectedTableName: string = useAppSelector((state) => state.table.selectedTableName);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedTableName({ newSelectedTableName: event.target.value as string }));
  };

  return (
    <FormControl
      id='table-form-control'
      size='small'
      sx={{
        alignSelf: 'flex-start',
        marginBottom: '2rem',
      }}
    >
      <InputLabel id='table-select-label'>Table</InputLabel>
      <Select
        labelId='table-select-label'
        id='table-select'
        label='table'
        value={selectedTableName}
        onChange={handleChange}
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

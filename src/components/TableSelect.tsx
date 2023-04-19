import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { setSelectedTableName1, setTable1 } from '../features/table/tablesSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { DB_NAMES } from '../constants';
import { getDbTable } from '../api';

const TableSelect = () => {
  const dispatch = useAppDispatch();
  const selectedTableName: string = useAppSelector((state) => state.tables.selectedTableName1);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedTableName1({ newSelectedTableName: event.target.value }));
    getDbTable(event.target.value)
      .then((newData) => dispatch(setTable1({ newTable: newData })))
      .catch((error) => console.error(error));
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

import _ from 'lodash';
import { Avatar, Box, Typography } from '@mui/material';

import MainCharts from './components/MainCharts';
import SidePanel from './components/SidePanel';
import logo from './assets/logo-ukw.jpg';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Box
        id='main-window'
        sx={{
          display: 'flex',
          marginLeft: 'calc(200px + 4rem)',
        }}
      >
        <SidePanel />
        <Box
          sx={{
            width: 'calc(100% - 3rem)',
            height: '4rem',
            backgroundColor: '#fff',
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '-34px 9px 11px -13px rgba(66, 68, 90, 1)',
            padding: '0 2rem 0 1rem',
            zIndex: 10,
          }}
        >
          <Avatar
            alt='Logo UKW'
            src={logo}
          />
          <Typography
            variant='h2'
            sx={{ color: '#000', fontSize: '1.2rem' }}
          >
            Aplikacja do wizualizacji danych meteorologicznych dla miasta Bydgoszcz
          </Typography>
        </Box>
        <MainCharts />
      </Box>
    </div>
  );
}

export default App;

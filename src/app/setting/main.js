'use client'

import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import HomeIcon from '@mui/icons-material/Home';
import React, { useState, useMemo } from "react";
import Card from '@mui/material/Card';
import SettingsIcon from '@mui/icons-material/Settings';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import { Prompt } from './pages/prompt';
import { Foundation } from './pages/Foundation';
import { Group } from './pages/gro';

export default function Main({ fount }) {
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }} >
      <Card sx={{ position: 'sticky', top: 0, boxShadow: ' rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;', }}>
        <div style={{ padding: '16.4px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <SettingsIcon sx={{ color: 'var(--main)' }} />
          <p className='text_2'>CÀI ĐẶT</p>
        </div>
        <BottomNavigation sx={{ width: '100%', justifyContent: 'start', borderTop: 'thin solid var(--main)' }} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Thông tin"
            value="1"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Thành viên"
            value="2"
            icon={<PeopleAltRoundedIcon />}
          />
          <BottomNavigationAction
            label="Nền tảng"
            value="3"
            icon={<FacebookRoundedIcon />}
          />
        </BottomNavigation>
      </Card>
      <div style={{ flex: 1 }} >
        {value == 1 ? <Prompt /> : value == 2 ? <Group /> : <Foundation data={fount} />}
      </div>
    </Box>
  )
}
'use client'

import { useState, useEffect } from 'react';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import CalendarDay_Sever from './sever'
import Dialog from '@mui/material/Dialog';

export default function CalendarDay_Client({ e }) {
  const [open, setOpen] = useState(false);
  const [data, setdata] = useState()
  const handleClickOpen = () => {
    fetch(`/api/getLessons?courseName=${e.CourseID}&lessonsName=${e.ID}`).then(response => response.json()).then(d => {
      if (d) setdata(d)
      else { console.error('Token not found') }
    }).catch(error => console.error('Error fetching token:', error));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="Hover_shadow" style={{ display: 'flex', gap: 2, backgroundColor: 'white', color: '#3b4056', borderBottom: '1px solid #e5e6e8' }}
        onClick={handleClickOpen}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1, padding: '12px 0', paddingLeft: '16px' }}><ScheduleRoundedIcon />{e.Time}</div>
        <div style={{ flex: 4, justifyContent: 'start', gap: 8 }} className='flexCenter'>
          <div className='dot' style={{ backgroundColor: '#00851b' }}></div>
          <span style={{ fontWeight: '500' }}>Chủ đề:</span> {e.Topic} - Lớp: {e.CourseID}
        </div>
        <div style={{ flex: .7, justifyContent: 'end', paddingRight: '16px' }} className='flexCenter'>{
          e.Room == 'Lab_B304' || e.Room == 'T&A' || e.Room == 'B304' ? <p className='Chip text_4_m' style={{ backgroundColor: 'rgb(255, 171, 0)', color: 'white' }}>Biên Hòa</p> :
            e.Room == 'AI Robotic' ? <p className='Chip text_4_m' style={{ backgroundColor: '#007867', color: 'white' }}>Long Khánh</p> :
              <p className='Chip text_4_m' style={{ backgroundColor: 'rgb(0, 150, 177)', color: 'white' }}>Long Thành</p>
        }</div>
      </div>
      <Dialog
        sx={{ maxHeight: '100vh' }}
        fullWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description">
        <div>
          {data ? <CalendarDay_Sever data={data} topic={e.CourseID} /> : <div style={{ padding: 20 }} className='flexCenter'>loading...</div>}
        </div>
      </Dialog>
    </>
  );
}
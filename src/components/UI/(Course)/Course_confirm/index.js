'use client'
import { useState } from 'react';
import Button from "@mui/material/Button";
import fetchApi from '@/utils/API_suport/fetchData';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function Course_confirm({ status, id, student, stcourse }) {
  const [isLoading, setIsLoading] = useState(false);

  const csCourse = async () => {
    setIsLoading(true)
    try {
      await fetchApi('/Course_Update/confirm', { method: 'POST', body: JSON.stringify({ id, student }) });
    } catch (error) { console.log(error) }
    setIsLoading(false)
  }

  return (
    <>
      {stcourse ? <p className='text_4' style={{ color: 'green', marginTop: 16 }}>Đã hoàn thành khóa học</p> :
        <Button variant="contained" sx={{ mt: 2 }} disabled={status ? null : 'disabled'} onClick={csCourse}>Xác nhận hoàn thành khóa học</Button>
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
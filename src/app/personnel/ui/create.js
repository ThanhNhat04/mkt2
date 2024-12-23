'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { setValueInpue } from '@/app/function';

export default function Personnel_create() {

  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'input',
      name: 'User',
      label: 'Thành viên',
      required: true,
    },
    {
      type: 'input',
      name: 'Role',
      label: 'Vai trò',
      required: true,
    }
  ];

  const handleSave = async (data) => {
    setIsLoading(true)
    console.log(data);

    // try {
    //   const response = await fetch('https://todo.tr1nh.net/api/task', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   setIsLoading(false);

    //   if (response.ok) {
    //     window.location.reload();
    //   } else {
    //     const errorData = await response.json();
    //     alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
    //   }
    // } catch (error) {
    //   setIsLoading(false);
    //   alert(`Đã xảy ra lỗi: ${error.message}`);
    // }

    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
              <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm thành viên
            </div>
          }
          title="Thêm thành viên"
          fields={fields}
          onSave={handleSave}
        />
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

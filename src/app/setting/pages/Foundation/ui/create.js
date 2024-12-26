'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function Fount_Create({ department, user, token }) {
  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'input',
      name: 'name',
      label: 'Tên dự án',
      required: true,
    },
    {
      type: 'select',
      name: 'piority',
      label: 'Sự ưu tiên',
      required: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
      ],
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Mô tả dự án',
      required: true,
    },
    {
      type: 'textarea',
      name: 'notes',
      label: 'Ghi chú',
      required: false,
    },
  ];

  const handleSave = async (data) => {
    setIsLoading(true)
   
    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
              <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm nền tảng
            </div>
          }
          title="Tạo dự án"
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

'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import fetchApi from '@/utils/API_suport/fetchData';

export default function Fount_Create({ }) {

  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'select',
      name: 'type',
      label: 'Nền tảng',
      required: true,
      options: [
        { value: 'Facebook', label: 'Facebook' },
        { value: 'Instagram', label: 'Instagram' },
        { value: 'Youtube', label: 'Youtube' }
      ],
    },
    {
      type: 'input',
      name: 'name',
      label: 'Tên nền tảng',
      required: true,
    },
    {
      type: 'input',
      name: 'banner',
      label: 'Link hình ảnh',
      required: true,
    },
    {
      type: 'input',
      name: 'link',
      label: 'Link nền tảng',
      required: true,
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Chi tiết',
      required: true,
    }
  ];

  const handleSave = async (data) => {
    setIsLoading(true)
    console.log(data);

    try {
      await fetchApi('/found_create', { method: 'POST', body: JSON.stringify(data) });
    } catch (error) { console.log(error) }
    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter' style={{ height: 39, background: 'white', p: 0, borderRadius: 3, cursor: 'pointer', color: 'var(--main)', padding: '0 16px', gap: 8 }} >
              <AddBoxRoundedIcon sx={{ color: 'var(--main)', fontSize: 18 }} /> Thêm nền tảng
            </div>
          }
          title="Tạo thêm nền tảng"
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

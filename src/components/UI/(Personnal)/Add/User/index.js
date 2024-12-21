'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import fetchApi from '@/utils/API_suport/fetchData';

export default function Personnal_Add_User() {
  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'input',
      name: 'Name',
      label: 'Tên người dùng',
      required: true,
    },
    {
      type: 'input',
      name: 'Email',
      label: 'Email',
      required: true,
    },
    {
      type: 'input',
      name: 'Phone',
      label: 'Số điện thoại',
      required: true,
    },
    {
      type: 'input',
      name: 'Address',
      label: 'Địa chỉ thường trú',
      required: true,
    },
    {
      type: 'select',
      name: 'Role',
      label: 'Chọn quyền',
      required: true,
      options: [
        { label: 'Quản lý', value: 'MG' },
        { label: 'Giảng viên', value: 'TC' },
      ],
    },
  ];

  const handleSave = async (data) => {
    setIsLoading(true)
    try {
      await fetchApi('/User_Create/c_user', { method: 'POST', body: JSON.stringify(data) });
    } catch (error) { console.log(error) }
    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <Button sx={{ background: 'var(--main)' }} variant="contained" startIcon={<AddBoxRoundedIcon sx={{ color: 'white', fontSize: 30 }} />}>
              Thêm Người Dùng
            </Button>
          }
          title="Tạo người dùng mới"
          fields={fields}
          onSave={handleSave}
        />
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

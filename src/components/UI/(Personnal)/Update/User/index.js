'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import fetchApi from '@/utils/API_suport/fetchData';

export default function Personnal_Update_User({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'input',
      name: 'Email',
      label: 'Email',
      defaultValue: data.Email || ''
    },
    {
      type: 'input',
      name: 'Phone',
      label: 'Số điện thoại',
      defaultValue: data.Phone || ''
    },
    {
      type: 'select',
      name: 'Role',
      label: 'Chọn quyền',
      defaultValue: Object.keys(data.Role)[0] || '',
      options: [
        { label: 'Quản lý', value: 'MG' },
        { label: 'Giảng viên', value: 'TC' },
      ],
    },
  ];
  const handleSave = async (datas) => {
    datas.id = data.Email
    setIsLoading(true)
    try {
      await fetchApi('/User_Update', { method: 'POST', body: JSON.stringify(datas) });
    } catch (error) { console.log(error) }
    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter'>{edits}</div>
          }
          title={"Chỉnh sửa thông tin " + data.Name}
          fields={fields}
          onSave={handleSave}
        />
      </Box >
      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
const edits = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={20} height={20} fill='var(--icon_1)'>
    <path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zM325.8 139.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-21.4 21.4-71-71 21.4-21.4c15.6-15.6 40.9-15.6 56.6 0zM119.9 289L225.1 183.8l71 71L190.9 359.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" /></svg>
)

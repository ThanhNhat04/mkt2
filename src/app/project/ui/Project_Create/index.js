'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { setValueInpue, getTodayDate } from '@/app/function';

export default function Project_Create({ department, user, token }) {
  department = setValueInpue(department, 'name', '_id')
  let today = getTodayDate()
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
      name: 'department',
      label: 'Phòng ban',
      required: true,
      options: department,
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Thời gian bắt đầu',
      required: true,
      defaultValue: today,
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Thời gian kết thúc',
      required: true,
      defaultValue: today,
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
    data.leader = [user.id]
    try {
      const response = await fetch('https://todo.tr1nh.net/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}`,
        },
        body: JSON.stringify(data),
      });

      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
    setIsLoading(false)
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
              <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm dự án
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

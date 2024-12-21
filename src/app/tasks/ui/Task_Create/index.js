'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { getTodayDate, setValueInpue } from '@/app/function';

export default function Task_Create({ dataType, dataProject, token, user, users, projects }) {
  let today = getTodayDate()
  const type = dataType.map(item => ({
    label: item.name,
    value: item.id
  }));

  const project = dataProject.map(item => ({
    label: item.name,
    value: item.id
  }));


  let doers = setValueInpue(users, 'Name', '_id')

  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    {
      type: 'select',
      name: 'project',
      label: 'Dự án',
      required: true,
      options: project,
    },
    {
      type: 'select',
      name: 'taskCategory',
      label: 'Loại công việc',
      required: true,
      options: type,
    },
    {
      type: 'select',
      name: 'doer',
      label: 'Người thực hiện',
      required: true,
      defaultValue: user,
      options: doers,
    },
    {
      type: 'input',
      name: 'name',
      label: 'Tên công việc',
      required: true,
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Thời gian bắt đầu',
      defaultValue: today,
      required: true,
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Thời gian kết thúc',
      defaultValue: today,
      required: true,
    },
    {
      type: 'textarea',
      name: 'detail',
      label: 'Chi tiết công việc',
      required: true,
    },
    {
      type: 'textarea',
      name: 'notes',
      label: 'Ghi chú',
    },


  ];

  const handleSave = async (data) => {
    data.doer = user
    data.doerDone = false
    data.checkerDone = false
    setIsLoading(true)

    for (let i in dataProject) {
      if (dataProject[i].id == data.project) {
        data.checker = dataProject[i].leader[0]
      }
    }

    try {
      const response = await fetch('https://todo.tr1nh.net/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
  };

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
              <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm công việc
            </div>
          }
          title="Tạo công việc"
          fields={fields}
          onSave={handleSave}
        />
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: 99999 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
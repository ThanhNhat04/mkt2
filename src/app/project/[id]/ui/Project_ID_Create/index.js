'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { setValueInpue } from '@/app/function';
import fetchApi from '@/utils/API_suport/fetchData';

export default function Project_AddMember({ users, members, project }) {


  const idsInArray2 = new Set(members.map(item => item._id));
  const filteredArray = users.filter(item => !idsInArray2.has(item._id));
  const SelectUser = setValueInpue(filteredArray, 'Name', '_id')

  const [isLoading, setIsLoading] = useState(false);
  const fields = [
    {
      type: 'select',
      name: 'members',
      label: 'Thành viên',
      required: true,
      options: SelectUser,
    },
    {
      type: 'select',
      name: 'role',
      label: 'Vai trò',
      required: true,
      options: [
        { label: 'Thành viên', value: 2 },
        { label: 'Quản lý', value: 1 }
      ],
    }
  ];

  const handleSave = async (data) => {
    setIsLoading(true)
    data.project = project
    try {
      await fetchApi('/Project_AddMenbers', { method: 'POST', body: JSON.stringify(data) });
    } catch (error) { console.log(error) }
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

'use client';

import { useState } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import {
  Snackbar,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function Tool_update({ datax, data }) {
  console.log(data);

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSave = async (data) => {
    data.id = datax
    const response = await fetch('/api/Tool_update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.air === 2) {
      setOpenSnackbar(true);
      window.location.reload();
    } else {
      setOpenSnackbar(true);
    }
  };

  const fields = [
    {
      type: 'input',
      name: 'Name',
      label: 'Tên tool',
      defaultValue: data.Name
    },
    {
      type: 'input',
      name: 'Description',
      label: 'Mô tả',
      defaultValue: data.Description
    },
    {
      type: 'input',
      name: 'Image',
      label: 'Đường dẫn hình ảnh',
      defaultValue: data.Image
    },
    {
      type: 'input',
      name: 'Tool',
      label: 'Đường dẫn tool',
      defaultValue: data.Tool
    }, {
      type: 'input',
      name: 'Tag',
      label: 'Tag',
      defaultValue: data.Tag
    },
  ];

  return (
    <>
      <Box sx={{ width: 'max-content', height: '100%' }}>
        <Popup_Form
          button={
            <Button
              sx={{
                position: 'absolute', top: 8, right: 8, minWidth: 28, minHeight: 28, width: 28, height: 28, backgroundColor: 'primary.main', borderRadius: 1, color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <EditNoteIcon />
            </Button>
          }
          title="Cập nhập dự án"
          fields={fields}
          onSave={handleSave}
        />
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Không hợp lệ: Đường dẫn phải bắt đầu bằng "https://".
        </MuiAlert>
      </Snackbar>
    </>
  );
}
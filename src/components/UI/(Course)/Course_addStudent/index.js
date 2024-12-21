'use client'

import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import fetchApi from '@/utils/API_suport/fetchData';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function Course_addStudent({ data, un, course }) {

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedStudents, setSelectedStudents] = React.useState([]);
  const datanew = data.filter(e => !un.some(u => u.ID === e.ID));
  const [isLoading, setIsLoading] = React.useState(false);


  const handleSave = async () => {
    setIsLoading(true)
    try {
      data = await fetchApi('/Course_Update/addStudent', {
        method: 'POST',
        body: JSON.stringify({
          sources: 1,
          id: course,
          newStudent: selectedStudents.map(student => student._id)
        })
      })
    } catch (error) {
      console.log(error);
      data = null
    }
    setIsLoading(false)
  };

  return (
    <React.Fragment>
      <Box onClick={handleClickOpen}>
        <Box sx={{ bgcolor: 'vamColor.background', width: '40px', height: '40px', borderRadius: '5px' }} className="flexCenter"><PersonAddRoundedIcon /></Box>
      </Box>
      <Dialog
        fullWidth='sm'
        maxWidth='sm'
        open={open}
        onClose={handleClose}>
        <Box sx={{ px: 3, py: 2 }}>
          <Box className="Title_Popup" sx={{ mb: 2 }}>Thêm học sinh vào khóa học</Box>
          <Box>
            <Autocomplete
              multiple
              options={datanew}
              getOptionLabel={(option) => option.ID + ': ' + option.Name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Nhập ID học sinh"
                  placeholder="Nhập ID học sinh"
                />
              )}
              value={selectedStudents}
              onChange={(event, value) => setSelectedStudents(value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', pt: 2 }}>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={handleSave}>Xác nhận</Button>
          </Box>
        </Box>
      </Dialog>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}


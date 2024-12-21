'use client'
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import vam from './index.module.css'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';

export default function Notice({ id, data, course, lesson }) {
  let note = ''
  if (data.Note) note = data.Note
  const [v, setv] = useState(note)
  const [open, setOpen] = useState(false);
  const [load, setload] = useState(false)
  const router = useRouter();

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const save = async () => {
    setload(true)
    try {
      const response = await fetch(`/api/offStudent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: course, ID: id, lesson: lesson, reason: v }),
      });
      const result = await response.json();
      setload(false)
      router.refresh()
    } catch (error) { }
  }

  return (
    <>
      <Box onClick={handleClickOpen} className={vam.hover}><RadioButtonUncheckedIcon /></Box>
      <Dialog
        fullWidth='sm'
        maxWidth='sm'
        open={open}
        onClose={handleClose}>
        <Box>
          <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>Ghi chú lý do</Box>
          <Box sx={{ p: 2 }}>
            <TextField
              sx={{ width: '100%' }}
              size='small'
              multiline
              rows={4}
              variant="standard"
              label='Ghi lý do'
              defaultValue={v}
              onChange={(e) => setv(e.target.value)}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2, py: 1, borderTop: 'thin solid var(--background_1)', gap: 1 }}>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={save}>Lưu lý do</Button>
          </Box>
        </Box>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: 9999999 })}
          open={load}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog>
    </>
  );
}
'use client';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import RoomRoundedIcon from '@mui/icons-material/RoomRounded';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import AIR_BoxFile from '@/components/UI/(All)/AIR_BoxFile';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Calendar_Feedback from '@/components/UI/(Celendar)/CalendarFeedback';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import UI_Calendar_upImage from '../Calendar_UI_upImage';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CalendarCourse({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [rollCall, setRollCall] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (open && !hasFetched) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/getLessons?courseName=${data.ID}&lessonsName=${data.Lesson}`);
          let datas = await response.json();
          setValue(datas);
          setRollCall(datas.course.Student);
          setHasFetched(true);
        } catch (error) {
          console.error('Lỗi:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [open, data.ID, data.Lesson, hasFetched]);


  const onSaveCmt = (id, cmt) => {
    setRollCall(prevState =>
      prevState.map(student => {
        if (student.ID === id) {
          return {
            ...student,
            Learn: {
              ...student.Learn,
              [data.Lesson]: {
                ...student.Learn[data.Lesson],
                Cmt: cmt
              }
            }
          };
        }
        return student;
      })
    );
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let cm = 0;
  let vk = 0;
  let vc = 0;

  if (rollCall) {
    rollCall.forEach(r => {
      r.Learn[data.Lesson].Checkin == 1 ? cm++ : r.Learn[data.Lesson].Checkin == 2 ? vk++ : r.Learn[data.Lesson].Checkin == 3 ? vc++ : null;
    })
  }

  function updateCheckin(id, e) {
    setRollCall(prevState =>
      prevState.map(student => {
        if (student.ID === id) {
          return {
            ...student,
            Learn: {
              ...student.Learn,
              [data.Lesson]: {
                ...student.Learn[data.Lesson],
                Checkin: e.target.value
              }
            }
          };
        }
        return student;
      })
    );
  }

  function updateRollCall() {
    setIsLoading(true);
    const g = async () => {
      try {
        const response = await fetch('/api/updateRollCall', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Course: data.ID, Lessons: data.Lesson, Data: rollCall }),
        });
        let datas = await response.json();
        if (datas) {
          setIsLoading(false);
          setOpen(false);
        }
      } catch (error) {
        console.error('Lỗi:', error);
      }
    };
    g();
  }
  console.log(value, data);

  return (
    <>
      <Box className="Calendar_Course" sx={{ display: 'flex', justifyContent: 'space-between', m: 2, position: 'relative', cursor: 'pointer' }} onClick={handleClickOpen}>
        <Box className="Calendar_Course-dot" sx={{ height: '100%', width: '3px', bgcolor: '#e67300', position: 'absolute', top: 0, left: 0 }}></Box>
        <Box className="Calendar_Course-content" sx={{ p: 1.5, pl: 3, zIndex: 1, transition: 'all .1s linear' }}>
          <Box sx={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: 1, mb: .5 }}>
            <AccessTimeFilledRoundedIcon /> {data.Time ? data.Time : 'Thời gian ngẫu nhiên'}
          </Box>
          <Box>
            <span style={{ fontWeight: '500' }}>Chủ đề:</span> {data.Topic ? data.Topic : 'Chủ đề ngẫu nhiên'}
          </Box>
          <Box>
            <span style={{ fontWeight: '500' }}>Giáo viên:</span> {data.Teacher ? data.Teacher : 'Giáo viên ngẫu nhiên'}
          </Box>
        </Box>
        <Box className="Calendar_Course-content h" sx={{ display: 'flex', zIndex: 1, transition: 'all .3s linear', alignItems: 'start', gap: 1, py: 2, m: 0 }}>
          <RoomRoundedIcon /> {data.Room ? data.Room : 'Phòng ngẫu nhiên'}
        </Box>
      </Box>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {data.ID ? data.ID : 'Khóa học ngẫu nhiên'} - Chủ đề: {data.Topic ? data.Topic : 'Chủ đề ngẫu nhiên'}
            </Typography>
            <div style={{ display: 'flex', margin: '0 16px', gap: 12 }}>
              <div style={{
                padding: '5px 15px', borderRadius: '8px',
                border: '2px solid #43a300', background: '#f3fff6', color: 'var(--text)', fontWeight: '500'
              }}>Có mặt: {cm}</div>
              <div style={{
                padding: '5px 15px', borderRadius: '8px',
                border: '2px solid #cc1d1d', background: 'white', color: 'var(--text)', fontWeight: '500'
              }}>Vắng không phép: {vk}</div>
              <div style={{
                padding: '5px 15px', borderRadius: '8px',
                border: '2px solid #d6be00', background: '#fffdf3', color: 'var(--text)', fontWeight: '500'
              }}>Vắng có phép: {vc}</div>
            </div>
            <Button color="inherit" onClick={(e) => updateRollCall(e)} sx={{ border: '2px solid white', borderRadius: '8px', px: 2 }}>
              Cập nhật
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container spacing={0} sx={{ height: '100%' }}>
          <Grid item xs={6} md={2} sx={{ p: 4 }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {value && value.course.Detail.Image ? <AIR_BoxFile type="Img" name="Hình ảnh"
                href={'https://drive.google.com/drive/u/0/folders/' + value.course.Detail.Image} /> : null}
              {value && value.slide ? (
                <AIR_BoxFile type="Ppt" name="Slide giảng dạy" href={value.slide} />
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={6} md={10} sx={{ pt: 4 }}>
            <Box sx={{ width: '100%', height: 'calc(100% - 32px)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 1, p: 2, boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;', borderRadius: '6px', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 2, p: 1, bgcolor: 'var(--main)', color: 'white', width: 'max-content' }}>
                  <Box sx={{ borderRight: '1px solid white', ml: 2, pr: 2 }}>Thời gian: <span style={{ fontWeight: '600' }}>{data.Time ? data.Time : 'Thời gian ngẫu nhiên'}</span></Box>
                  <Box sx={{ borderRight: '1px solid white', ml: 2, pr: 2 }}>Giáo viên giảng dạy: <span style={{ fontWeight: '600' }}>
                    {data.Teacher ? data.Teacher : 'Không có giáo viên'}</span></Box>
                  <Box sx={{ ml: 2, pr: 2 }}>Trợ giảng: <span style={{ fontWeight: '600' }}>{data.TeachingAs ? data.TeachingAs : 'Không có giáo viên trợ giảng'}</span></Box>
                </Box>
                <Box sx={{ height: '1px', width: '100%', bgcolor: '#e0e0e0', my: 1 }}></Box>
                <Box className="Title_Popup" sx={{ my: 1 }}>Sổ đầu bài</Box>
                {rollCall != null ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid black' }}>
                      {header.map(t => (
                        <Box key={t.title} sx={{ flex: `${t.size}`, justifyContent: `${t.align}`, display: 'flex', p: 1 }}>
                          {t.title}
                        </Box>
                      ))}
                    </Box>
                    <Box>
                      {rollCall.map(learnData => (
                        <Box key={learnData.ID} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #c9c9c9' }}>
                          <Box sx={{ flex: '2', justifyContent: 'start', display: 'flex', p: 1 }}>
                            {learnData.Name}
                          </Box>
                          <Box sx={{ flex: '2', justifyContent: 'center', display: 'flex', p: 1 }}></Box>
                          <RadioGroup sx={{ flex: '3', display: 'flex', p: 1, flexDirection: 'row' }} value={learnData.Learn[data.Lesson].Checkin}>
                            <FormControlLabel sx={{ flex: 1, display: 'flex', justifyContent: 'center' }} value="1" onClick={(e) => updateCheckin(learnData.ID, e)} control={<Radio />} />
                            <FormControlLabel sx={{ flex: 1, display: 'flex', justifyContent: 'center' }} value="2" onClick={(e) => updateCheckin(learnData.ID, e)} control={<Radio />} />
                            <FormControlLabel sx={{ flex: 1, display: 'flex', justifyContent: 'center' }} value="3" onClick={(e) => updateCheckin(learnData.ID, e)} control={<Radio />} />
                          </RadioGroup>
                          <Box sx={{ flex: '1', justifyContent: 'center', display: 'flex', p: 1 }}>
                            <Calendar_Feedback id={learnData.ID} cmt={learnData.Learn[data.Lesson].Cmt} onSave={onSaveCmt} />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 1 }}>
                    <p className="content">Không có học sinh tham gia khóa học</p>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {isLoading && (
          <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </Dialog>
    </>
  );
}

const header = [
  { title: 'Họ và Tên', size: '2', align: 'start' },
  { title: '', size: '2', align: 'center' },
  { title: 'Có mặt', size: '1', align: 'center' },
  { title: 'Không phép', size: '1', align: 'center' },
  { title: 'Có phép', size: '1', align: 'center' },
  { title: 'Nhận xét', size: '1', align: 'center' }
];

'use client'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import vam from './index.module.css'
import Button from '@mui/material/Button';
import { Avatar } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}/${month}/${day}`;
};

export default function Course_editCalendar({ icon, data }) {
  const [dt, setdt] = useState(data.Detail)
  const [load, setload] = useState(false)
  // Thao tác popup 0
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [tab, settab] = useState(0);
  const handleChange = (e, newValue) => settab(newValue)


  // Thao tác popup 1
  const [p1, setp1] = useState([0, false])
  const [v1, setv1] = useState()
  const [fc, setfc] = useState(null)
  function inP1(e, value) { setfc(value); setp1([p1[0], true]) }
  const outP1 = () => setp1([0, false])
  const saveP1 = async () => {
    setload([load[0], true, load[2]])
    try {
      const response = await fetch(`/api/offLesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: data._id, lesson: fc.ID, reason: v1 }),
      });
      const result = await response.json();
      setdt(result.data);
    } catch (error) { console.error('Failed to add students to course:', error) }
    // Cập nhật dữ liệu trạng thái
    setdt(prevDt => prevDt.map(item => item.ID == fc.ID ? { ...item, off: v1 } : item));
    setload([load[0], false, load[2]])
    setp1([0, false]);
  };
  const input = (event) => { const { value } = event.target; setv1(value) }
  // Tháo tác popup 2
  const [p2, setp2] = useState([0, false])
  const [v2, setv2] = useState([0, 0])
  function inP2(e, value) {
    setfc(value);
    setv2([value.Teacher, value.TeachingAs])
    setp2([p1[0], true])
  }
  const outP2 = () => setp2([0, false])
  const saveP2 = async () => {
    setload([load[0], load[1], true])
    try {
      const response = await fetch(`/api/updateLesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: data._id, lesson: fc.ID, teacher: v2[0], ass: v2[1] }),
      });
      const result = await response.json();
      setdt(result.data);
    } catch (error) { console.error('Failed to add students to course:', error) }
    setload([load[0], load[1], false])
    setp2([0, false]);
  };

  /* p3 */
  const [v3, setv3] = useState([0, 0, 0, 0, 0, data.Student.map(student => { return { ID: student.ID, Name: student.Name } })])
  const saveP3 = async () => {
    setload([true, load[1], load[2]])
    try {
      const response = await fetch(`/api/createLesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: data._id, ID: v3[0].ID, topic: v3[0].Topic, teacher: v3[1], ass: v3[2], room: v3[3], day: v3[4], lesson: 4, image: data.Image, student: v3[5] }),
      });
      const result = await response.json();
      setdt(result.data);
    } catch (error) { }
    setload([false, load[1], load[2]])
  };

  return (
    <>

      <Box onClick={handleClickOpen}>{icon}</Box>
      <Dialog fullWidth={true} maxWidth='md' open={open} onClose={handleClose} disableEnforceFocus={true}>
        <div style={{ minHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Tabs sx={{ borderBottom: 'thin solid var(--background_2)', minHeight: '72px' }} value={tab} onChange={handleChange} aria-label="icon label tabs example">
            <Tab icon={<EventBusyIcon />} iconPosition="start" label="CẬP NHẬT LỊCH" />
            <Tab icon={<EventRepeatIcon />} iconPosition="start" label="TẠO LỊCH BÙ" />
          </Tabs>
          <div style={{ overflow: 'hidden', overflowY: 'auto' }} className='Wrap_Scroll'>
            {tab == 0 ?
              <div style={{ maxHeight: 'calc(80vh - 72px)', overflow: 'hidden', overflowY: 'auto', background: 'var(--background_1)' }} className='Wrap_Scroll'>
                {dt.map((t, index) => {
                  let bg = ''
                  let co = 'unset'
                  if (!(new Date(formatDate(new Date())) < new Date(t.Day.slice(6) + '/' + t.Day.slice(3, 5) + '/' + t.Day.slice(0, 2)))) {
                    bg = '#e0e0e0'
                    co = '#adadad'
                  }

                  return (
                    <div key={index} className={vam.wrap} style={{ background: bg }}>
                      <div style={{ display: 'flex', padding: '4px 0' }}>
                        <div style={{ padding: '4px 12px', borderRadius: '3px', aspectRatio: 1, background: 'var(--main)' }} className='flexCenter'>
                          <p className='text_4_m' style={{ color: 'white' }}>{index}</p>
                        </div>
                        <div style={{ padding: '2px 8px 2px 16px', display: 'flex', flexDirection: 'column' }}>
                          <p className='text_3' style={{ color: co }}>{t.ID}: {t.Topic}</p>
                          <p className='text_4_m' style={{ color: co }}>Thời gian học: {t.Time} ngày {t.Day}</p>
                        </div>
                      </div>
                      <div>
                        {bg ? <></> : t.Reason ? <p className='text_4_m Chip' style={{ background: '#f26868', color: 'white' }}>Đã báo nghỉ</p> :
                          <div className={vam.icon}>
                            <div className={vam.icon_wrap} style={{ background: '#FFA500' }}
                              onClick={new Date(formatDate(new Date())) < new Date(t.Day.slice(6) + '/' + t.Day.slice(3, 5) + '/' + t.Day.slice(0, 2)) ? (e) => inP2(e, t) : null}>
                              <EditCalendarIcon sx={{ color: 'red', fontSize: 18 }} />
                            </div>
                            <div className={vam.icon_wrap} onClick={new Date(formatDate(new Date())) < new Date(t.Day.slice(6) + '/' + t.Day.slice(3, 5) + '/' + t.Day.slice(0, 2)) ? (e) => inP1(e, t) : null} >
                              <EventBusyIcon sx={{ color: 'red', fontSize: 18 }} />
                            </div>
                          </div>}
                      </div>
                    </div>
                  )
                })}
              </div> : tab == 1 ?
                <div >
                  <div style={{ margin: '10px', padding: '10px', background: 'white' }}>
                    <p className='text_3'>Thông tin học bù</p>
                    <Autocomplete
                      size='small'
                      disablePortal
                      options={dt.filter((item, index, self) => index === self.findIndex((t) => t.ID === item.ID))}
                      getOptionLabel={(option) => (option.ID + ': ' + option.Topic)}
                      sx={{ margin: '8px auto' }}
                      renderInput={(params) => <TextField {...params} label="Chủ đề" />}
                      onChange={(event, newValue) => setv3([newValue, v3[1], v3[2], v3[3], v3[4], v3[5]])} />
                    <TextField onChange={(event) => setv3([v3[0], v3[1], v3[2], v3[3], event.target.value, v3[5]])} sx={{ margin: '0 auto', width: '100%' }} size='small' required id="time" name="time" type="datetime-local" />
                    <Autocomplete
                      size='small' disablePortal options={teacher}
                      getOptionLabel={(option) => option} sx={{ margin: '12px auto' }}
                      renderInput={(params) => <TextField {...params} label="Giáo viên đứng chính" />}
                      onChange={(event, newValue) => setv3([v3[0], newValue, v3[2], v3[3], v3[4], v3[5]])} />
                    <Autocomplete
                      size='small' disablePortal options={teacher}
                      getOptionLabel={(option) => option} sx={{ margin: '12px auto' }}
                      renderInput={(params) => <TextField {...params} label="Giáo viên trợ giảng" />}
                      onChange={(event, newValue) => setv3([v3[0], v3[1], newValue, v3[3], v3[4], v3[5]])} />
                    <Autocomplete
                      size='small' disablePortal options={['T&A Lab', 'TT Khai Trí']}
                      getOptionLabel={(option) => option} sx={{ margin: '12px auto' }}
                      renderInput={(params) => <TextField {...params} label="Phòng dạy" />}
                      onChange={(event, newValue) => setv3([v3[0], v3[1], v3[2], newValue, v3[4], v3[5]])} />
                    <p className='text_3' style={{ paddingBottom: 8 }}>Danh sách học sinh</p>
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      options={v3[5]}
                      getOptionLabel={(option) => option.ID + ': ' + option.Name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Nhập ID học sinh"
                          placeholder="Nhập ID học sinh"
                        />
                      )}
                      defaultValue={v3[5]}
                      onChange={(event, newValue) => setv3([v3[0], v3[1], v3[2], v3[3], v3[4], newValue])} />
                    <p className={vam.btb} onClick={saveP3}>Tạo lịch bù</p>
                  </div>
                </div>
                : <></>}
          </div>
        </div>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: 9999999 })}
          open={load[0]}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog >
      {/* Báo nghỉ */}
      <Dialog fullWidth={true} maxWidth='sm' open={p1[1]} onClose={outP1}>
        <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>Lý do báo nghỉ ngày </Box>
        <Box sx={{ p: 2 }}>
          <Box sx={{ maxWidth: '100%' }}>
            <TextField fullWidth label="Nhập lý do" rows={3} multiline variant="standard" onChange={input} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', p: 2, py: 1, borderTop: 'thin solid var(--background_1)', gap: 1 }}>
          <Button onClick={outP1}>Thoát</Button>
          <Button onClick={saveP1}>Lưu</Button>
        </Box>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: 9999999 })}
          open={load[1]}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog >
      {/* Cập nhập  */}
      <Dialog fullWidth={true} maxWidth='sm' open={p2[1]} onClose={outP2}>
        <div style={{ minHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>Cập nhập lịch dạy</Box>
          <Box sx={{ p: 2, flex: 1 }}>
            <p className='text_3' style={{ paddingBottom: 8 }}>Giáo viên giảng dạy</p>
            <Box sx={{ maxWidth: '100%' }}>
              <Autocomplete
                defaultValue={fc ? fc.Teacher : null}
                size='small' disablePortal options={teacher}
                getOptionLabel={(option) => option} sx={{ margin: '12px auto' }}
                renderInput={(params) => <TextField {...params} label="Giáo viên đứng chính" />}
                onChange={(event, newValue) => setv2([newValue, v2[1]])}
              />
              <Autocomplete
                defaultValue={fc ? fc.TeachingAs ? fc.TeachingAs : 'Trống' : null}
                size='small' disablePortal options={teacher}
                getOptionLabel={(option) => option} sx={{ margin: '12px auto' }}
                renderInput={(params) => <TextField {...params} label="Giáo viên trợ giảng" />}
                onChange={(event, newValue) => setv2([v2[0], newValue])}
              />
              <div>
                {fc ?
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p className='text_3'>Học sinh tham gia</p>
                    </div>
                    <div style={{ margin: '8px 0', maxHeight: '160px', overflow: 'hidden', overflowY: 'auto' }} className='Wrap_Scroll'>
                      {data.Student.map((t, index) =>
                      (<div key={index} style={{ padding: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={t.Avt} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <p className='text_3' style={{ margin: '0 16px ' }}>Họ và tên: {t.Name}</p>
                            <p className='text_4_m' style={{ margin: '0 16px ' }}>ID: {t.ID}</p>
                          </div>
                        </div>
                      </div>))}</div></> :
                  <></>}
              </div>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'end', p: 2, py: 1, borderTop: 'thin solid var(--background_1)', gap: 1 }}>
            <Button onClick={outP2}>Thoát</Button>
            <Button onClick={saveP2}>Lưu</Button>
          </Box>
        </div>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: 9999999 })}
          open={load[2]}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Dialog >
    </>
  );
}


const teacher = [
  'Hoàng Gia Huy',
  'Võ Tuấn Sĩ',
  'Nguyễn Hoàng Hưng',
  'Nguyễn Duy Độ',
  'Hoàng Thanh Nhật',
  'Bùi Bình Minh',
  'Phạm Bảo Minh Thế',
  'Huỳnh Trần Hữu Nhật',
  'Bùi Xuân Cảnh',
  'Nguyễn Minh Sơn',
  'Phan Thị Hường',
  'Nguyễn Khắc Hoàng',
  'Trống'
];
import Box from '@mui/material/Box';

import CalendarDay_Client from './CalendarDay_Client';

export default function CalendarDay({ day, lesson }) {
  const dayOfWeek = fAIR_dayOfWeek(day);
  const today = new Date();
  const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  return (<>
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: todayFormatted == day ? 'var(--main)' : '#f2f2f4',
      color: todayFormatted == day ? 'white' : '#3b4056',
      borderBottom: '1px solid #e5e6e8'
    }}>
      <Box sx={{ fontWeight: '600' }}>Ngày {day} {todayFormatted == day ? <>(Hôm nay)</> : null}</Box>
      <Box sx={{ mr: 2 }}>{dayOfWeek}</Box>
    </Box>
    {lesson.length ?
      <> {lesson.map((e, index) => (<CalendarDay_Client key={index} e={e} />))} </> :
      <Box sx={{ p: 2 }}>Không có lịch dạy hôm nay</Box>}
  </>)
};

// Hàm trả về thứ từ ngày được truyền vào hàm
function fAIR_dayOfWeek(dates) {
  const [day, month, year] = dates.split('/');
  const date = new Date(`${year}-${month}-${day}`);
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayOfWeekIndex = date.getDay();
  return daysOfWeek[dayOfWeekIndex];
}
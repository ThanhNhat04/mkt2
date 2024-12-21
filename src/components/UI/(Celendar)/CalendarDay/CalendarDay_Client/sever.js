import AIR_BoxFile from '@/components/UI/(All)/AIR_BoxFile'
import Link from 'next/link';
import InfoIcon from '@mui/icons-material/Info'
export default function CalendarDay_Sever({ data, topic }) {
  
  return (
    <div style={{ height: 'max-content' }}>
      <div className="Title_Popup" style={{ padding: 16, borderBottom: 'thin solid #cecece', display: 'flex', gap: 12, alignItems: 'center' }}>Lớp: {topic}
        <Link className='flexCenter' href={'/course/' + topic + '/' + data.course.Detail.ID}><InfoIcon sx={{color:'var(--text)'}} /></Link></div>
      <div style={{ padding: 16, background: 'var(--background)' }}>
        <p className="Title_Popup" style={{ marginBottom: 8 }}>Thông tin buổi học</p>
        <div style={{
          display: 'flex', gap: 8, flexDirection: 'column', padding: 12,
          boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px`, borderRadius: 8, background: 'white'
        }}>
          <div><strong>Chủ đề:</strong> {data.course.Detail.ID} - {data.course.Detail.Topic}</div>
          <div><strong>Giáo viên dạy chính:</strong> {data.course.Detail.Teacher}</div>
          <div><strong>Trợ giảng:</strong> {data.course.Detail.TeachingAs ? data.course.Detail.TeachingAs : 'Không có trợ giảng'}</div>
          <div><strong>Thời gian giảng dạy:</strong> {data.course.Detail.Time}</div>
          <div><strong>Phòng học:</strong> {data.course.Detail.Room}</div>
        </div>
        <p className="Title_Popup" style={{ margin: '16px 0 8px 0' }}>Thông tin học sinh (sĩ số: {data.course.Student.length} học sinh)</p>
        <div style={{
          display: 'flex', gap: 8, flexDirection: 'column', padding: 12,
          boxShadow: `rgba(0, 0, 0, 0.16) 0px 1px 4px`, borderRadius: 8, background: 'white', maxHeight: '170px', overflow: 'hidden', overflowY: 'scroll'
        }}>
          {data.course.Student.map(t => (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>{t.Name}</p>
              <p>{t.Learn[data.course.Detail.ID].Checkin ? t.Learn[data.course.Detail.ID].Checkin == 1 ? 'Có mặt' :
                t.Learn[data.course.Detail.ID].Checkin == 2 ? 'Vắng' : 'Vắng phép' : 'Chưa điểm danh'}</p>
            </div>
          ))}
        </div>
        <p className="Title_Popup" style={{ margin: '16px 0 8px 0' }}>Tài nguyên buổi học</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: '30%', background: 'white', borderRadius: 8, cursor: 'pointer' }}><AIR_BoxFile type='Ppt' name='Slide giảng dạy' href={data.slide}/></div>
          <div style={{ width: '30%', background: 'white', borderRadius: 8, cursor: 'pointer' }}><AIR_BoxFile type='Image' name='Hình ảnh buổi học' href={'https://drive.google.com/drive/folders/' + data.course.Detail.Image} /></div>
        </div>
      </div>
    </div>
  )
}

/*
 */
import vam from './index.module.css'
import Link from 'next/link'

export default function AIR_BoxCourse({ data, department }) {

  return (
    <Link href={`/project/${data._id}`} >
      <div className={vam.wrap} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className={vam.title}>
          <div style={{ flex: 1 }}>
            <div className={vam.title_text1}>
              <p className='text_2' style={{ marginBottom: 6 }}>{data.name}</p>
              <p className='Chip' style={{ background: 'var(--bienhoa_b)', color: 'var(--bienhoa_m)', fontSize: '14px' }}>{department.name}</p>
            </div>
            <p style={{
              color: 'var(--text_400)',
              fontSize: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>{data.description}</p>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            <span style={{ color: 'var(--text)' }}>Thời gian bắt đầu: {data.createdAt.split('T')[0].slice(-2)}/
              {data.createdAt.split('T')[0].slice(-5, -3)}/{data.createdAt.split('T')[0].slice(0, 4)}</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            <span style={{ color: 'var(--text)' }}>Số lượng quản lý: {data.leader.length}</span>
            <span style={{ color: 'var(--text_400)' }}> Thành viên</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            <span style={{ color: 'var(--text)' }}>Số lượng thành viên: {data.members.length}</span>
            <span style={{ color: 'var(--text_400)' }}> Thành viên</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            <span style={{ color: 'var(--text)' }}>Trạng thái dự án: {data.status} </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

'use client';

import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { Avatar } from '@mui/material';
import Personnal_Add_User from '../Add/User';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Personnal_Update_User from '../Update/User';
import Link from 'next/link';


export default function UserList({ data }) {
  const [page, setPage] = useState(1);
  const studentsPerPage = 4;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastStudent = page * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = data.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="user-list">
      <div className="actions">
        <Personnal_Add_User />
        <input className="search-input" placeholder="Tìm kiếm" />
      </div>

      <div className="table-header">
        <p style={{ flex: .3 }}></p>
        <p className="text_3" style={{ flex: 1, color: 'white', padding: '6px' }}>Họ và Tên</p>
        <p className="text_3 " style={{ flex: .8, color: 'white', padding: '6px' }}>Liên Hệ</p>
        <p className="text_3" style={{ flex: 1.3, color: 'white', padding: '6px' }}>Email</p>
        <p className="text_3" style={{ flex: .8, color: 'white', padding: '6px' }}>Quyền</p>
        <p className="text_3" style={{ flex: .5, color: 'white', padding: '6px' }}>Hành Động</p>
      </div>

      {currentStudents.map((student, index) => (
        <StudentRow key={index} data={student} role={data[1]} />
      ))}

      <div className="pagination">
        <Pagination
          count={Math.ceil(data.length / studentsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </div>

      <style jsx>{`
        .user-list {
          padding: 16px;
          background-color: white;
          box-shadow:var(--box);
          border-radius: 8px
        }

        .actions {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .action-btn {
          padding: 8px 12px;
          border-radius: 4px;
          border: none;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .create-btn {
          background-color: #4caf50;
          color: white;
        }

        .upload-btn {
          background-color: #ffcc80;
          color: #e65100;
        }

        .print-btn {
          background-color: #bbdefb;
          color: #1565c0;
        }

        .excel-btn {
          background-color: #e0f2f1;
          color: #00695c;
        }

        .pdf-btn {
          background-color: #f8bbd0;
          color: #c2185b;
        }

        .search-input {
          margin-left: auto;
          padding: 6px 12px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 300px;
        }

        .table-header {
          display: flex;
          background-color: var(--main);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
        }

        .header-item {
          flex: 1;
          text-align: center;
          font-weight: bold;
        }

        .pagination {
          margin-top: 16px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

function StudentRow({ data }) {
  return (
    <div className="student-row">
      <div style={{ flex: .3 }}><Avatar src={data.Avt} /></div>
      <p style={{ flex: 1 }} className='text_3_m'>{data.Name}</p>
      <p style={{ flex: .8 }} className='text_3_m'>{data.Phone || 'Trống'}</p>
      <p style={{ flex: 1.3 }} className='text_3_m'>{data.Email || 'Trống'}</p>
      <p style={{ flex: .8 }} className='text_3_m'>{Object.keys(data.Role)[0] || 'Trống'}</p>
      <Box sx={{ flex: '.5', display: 'flex', alignItems: 'center', color: 'var(--text)', fontWeight: '500', gap: 1 }}>
        <Tooltip title="Chi tiết"> <Link href={`/personnel/${data._id}`}><div className='icon_listUser flexCenter'>{svg_eye}</div></Link > </Tooltip>
        <Tooltip title="Sửa thông tin"> <div className='icon_listUser flexCenter'><Personnal_Update_User data={data} /></div> </Tooltip>
        <Tooltip title="Khóa tài khoản"> <div className='icon_listUser' style={{ marginLeft: 1 }}>{mon}</div> </Tooltip>
      </Box>

      <style jsx>{`
      .icon_listUser{
        width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
      }
      .icon_listUser:hover{
        cursor: pointer;
  background-color: var(--background_1);
      }
        .student-row {
          display: flex;
          padding: 12px 16px;
          background-color: white;
          border-bottom: 1px solid #ccc;
          align-items: center;
        }

        .student-item {
          flex: 1;
          text-align: center;
          font-size: 14px;
          color: var(--text);
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .view-btn {
          background-color: #2196f3;
          color: white;
        }

        .edit-btn {
          background-color: #ffc107;
          color: white;
        }

        .delete-btn {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div >
  );
}


const svg_eye = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={20} height={20} fill='var(--icon_1)'>
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>
)

const mon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={20} height={20} fill='var(--icon_1)' style={{ marginLeft: 2 }}>
    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l362.8 0c-5.4-9.4-8.6-20.3-8.6-32l0-128c0-2.1 .1-4.2 .3-6.3c-31-26-71-41.7-114.6-41.7l-91.4 0zM528 240c17.7 0 32 14.3 32 32l0 48-64 0 0-48c0-17.7 14.3-32 32-32zm-80 32l0 48c-17.7 0-32 14.3-32 32l0 128c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32l0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80z" />
  </svg>
)


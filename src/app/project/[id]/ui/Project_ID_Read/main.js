'use client'
import Grid from '@mui/material/Unstable_Grid2';
import { getFtoF } from '@/app/function';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import AlarmOnRoundedIcon from '@mui/icons-material/AlarmOnRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import React, { useState, useMemo } from "react";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Project_AddMember from '../Project_ID_Create';

export default function Main({ project, department, user }) {

  const members = getFtoF(project.members, user, '_id')
  const leader = getFtoF(project.leader, user, '_id')
  const departmentInP = getFtoF(project.department, department, '_id')
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log(value);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} >
      <Card sx={{ position: 'sticky', top: 0 }}>
        <div style={{ padding: '12px 16px' }}>
          <div className='text_1' style={{ paddingBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            Dự án: {project.name}
            <Chip label={departmentInP[0].name} size="small" color="primary" />
            <Chip label={project.status} size="small" color="primary" />
          </div>
          <p className='text_2_m' style={{ paddingBottom: 6 }}>  Dự án: {project.description} </p>
        </div>
        <BottomNavigation sx={{ width: '100%', justifyContent: 'start', borderTop: 'thin solid var(--main)' }} value={value} onChange={handleChange}>
          <BottomNavigationAction
            label="Thông tin"
            value="1"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Thành viên"
            value="2"
            icon={<PeopleAltRoundedIcon />}
          />
          <BottomNavigationAction
            label="Công việc"
            value="3"
            icon={<AssignmentIcon />}
          />
        </BottomNavigation>
      </Card>
      <div style={{ flex: 1 }} >
        <Content_Project data={project} tab={value} members={members} leader={leader} user={user} />
      </div>
    </Box>

  )
}

export function Content_Project({ data, tab, members, leader, user }) {
  const details = [
    {
      icon: <EventNoteRoundedIcon />,
      label: "Thời gian bắt đầu",
      value: data.createdAt,
    },
    {
      icon: <AlarmOnRoundedIcon />,
      label: "Mức độ ưu tiên",
      value: data.piority == 1 ? 'Cao' : 'Bình thường',
    },
    {
      icon: <PeopleAltRoundedIcon />,
      label: "Thành viên tham gia",
      value: data.members.length + ' Thành viên',
    },
    {
      icon: <ManageAccountsRoundedIcon />,
      label: "Quản lý dự án",
      value: data.leader.length + ' Quản lý',
    }
  ];


  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Grid container spacing={2} sx={{ m: 0, height: '100%' }}>
        <Grid xs={9} sx={{ p: 0 }}>
          <div className='Wrap_Scroll' style={{ paddingRight: 12, height: '100%', display: 'flex' }}>
            <div style={{
              background: 'white', flex: 1,
              borderRadius: 8, border: 'thin solid var(--background_1)'
            }}>
              {tab == 1 ? <Infor data={data} /> : tab == 2 ? <User data={data} user={user} members={members} leader={leader} /> : <Tasks />}
            </div>
          </div >
        </Grid>
        <Grid xs={3} sx={{ p: 0 }}>
          <div className='Wrap_Scroll' style={{ height: '100%', display: 'flex' }}>
            <div style={{
              padding: '16px', background: 'white', flex: 1,
              borderRadius: 8, border: 'thin solid var(--background_1)'
            }}>
              <Stack spacing={2}>
                {details.map((detail, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ color: "text.secondary" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "primary.main",
                      }}
                    >
                      {detail.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {detail.label}
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {detail.value}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </div>
          </div >
        </Grid>
      </Grid>
    </div>
  )
}


export function Infor({ data }) {
  return (
    <>
      <p className='text_2_m' style={{ borderBottom: 'thin solid var(--background_2)', padding: 16, display: 'flex', gap: 8 }}>
        Thông tin dự án </p>
      <div style={{ padding: 16 }}>
        Mô tả dự án: {data.description}
      </div>
    </>
  )
}

export function Tasks({ data }) {
  return (
    <>
      <p className='text_2_m' style={{ borderBottom: 'thin solid var(--background_2)', padding: 16, display: 'flex', gap: 8 }}>
        Tiến độ công việc </p>
      <div style={{ padding: 16 }}>
        Các hành động ...
      </div>
    </>
  )
}


export function User({ data, members, leader, user }) {
  console.log(data);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const allUsers = useMemo(() => {
    const leadersWithRole = leader.map(item => ({ ...item, DisplayRole: "Quản lý" }));
    const membersWithRole = members.map(item => ({ ...item, DisplayRole: "Thành viên" }));
    return [...leadersWithRole, ...membersWithRole];
  }, [members, leader]);

  // Logic tìm kiếm và lọc
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchSearch = user.Name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchFilter = roleFilter ? user.DisplayRole === roleFilter : true;
      return matchSearch && matchFilter;
    });
  }, [allUsers, searchTerm, roleFilter]);

  const handleAddMember = () => {
    alert("Thêm thành viên mới");
  };

  return (
    <div style={{ margin: '16px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '4px' }}>
      <p className='text_2' style={{ borderBottom: '1px solid #ccc', paddingBottom: '8px', fontWeight: 'bold' }}>
        Thành viên trong dự án
      </p>

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '16px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Tìm kiếm thành viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '10.5px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            outline: 'none'
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            minWidth: '150px',
            outline: 'none'
          }}
        >
          <option value="">Tất cả</option>
          <option value="Quản lý">Quản lý</option>
          <option value="Thành viên">Thành viên</option>
        </select>

        <Project_AddMember project={data._id} users={user} members={allUsers} />
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li
              key={user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '8px 0',
                borderBottom: '1px solid #ddd'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: '#fff'
                }}
              >
                {user.Name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{user.Name}</p>
                <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>Vai trò: {user.DisplayRole}</p>
              </div>
            </li>
          ))
        ) : (
          <li>
            <p style={{ color: '#555', fontStyle: 'italic' }}>Không tìm thấy thành viên nào.</p>
          </li>
        )}
      </ul>
    </div>
  );
}
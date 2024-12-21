'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import Divider from '@mui/material/Divider';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import LibraryAddCheckRoundedIcon from '@mui/icons-material/LibraryAddCheckRounded';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Link from 'next/link';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { getUserByProject } from '@/app/function';
import EmailIcon from '@mui/icons-material/Email';

export default function Task_Read_List({ student, type, dataType, dataProject, token, user, project, users }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const indexOfLastStudent = (page + 1) * rowsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
  const currentStudents = student.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <Box sx={{ width: '100%' }}>
      {currentStudents.map((student, index) => (
        <UI_Student_List key={index} userss={users} data={student} types={type} dataType={dataType} project={project} dataProject={dataProject} token={token} user={user} />
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2, borderTop: 'thin solid var(--background_1)' }}>
        <TablePagination
          component="div"
          count={student.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
}

function UI_Student_List({ data, types, dataType, userss, token, user, project }) {
  let sendname;
  for (let i in userss) {
    if (userss[i]._id == data.doer) {
      sendname = userss[i]
      break
    }
  }

  let userInProject = getUserByProject(userss, project, data)
  let startDate = data.startDate.split('T')[0].slice(-2) + '/' +
    data.startDate.split('T')[0].slice(-5, -3) + '/' + data.startDate.split('T')[0].slice(0, 4)
  let endDate = data.endDate.split('T')[0].slice(-2) + '/' +
    data.endDate.split('T')[0].slice(-5, -3) + '/' + data.endDate.split('T')[0].slice(0, 4)
  let users = userss
  let projects = project
  let type = types
  type.forEach(t => {
    if (t._id.toLowerCase() == data.taskCategory.toLowerCase()) type = t.name
  })
  projects.forEach(t => { if (t._id == data.project) projects = t.name })
  users.forEach(t => { if (t._id == data.checker) users = t.Name })

  const [subTask, setsubTask] = useState(false)
  const openSubTask = () => {
    if (subTask) setsubTask(false)
    else setsubTask(true)
  }


  if (typeof (type) == 'object') type = 'Không xác định'
  if (typeof (projects) == 'object') projects = 'Không xác định'
  if (typeof (users) == 'object') users = 'Không xác định'

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [detail, setdetail] = useState(false);

  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorE2);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick1 = (event) => {
    setAnchorE2(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose1 = () => {
    setAnchorE2(null);
  };
  const openDetail = () => setdetail(true)
  const detailClose = () => setdetail(false)

  // Sửa thông tin công việc 
  const typess = dataType.map(item => ({
    label: item.name,
    value: item.id
  }));


  const doers = userInProject.map(item => ({
    label: item.Name,
    value: item._id
  }))


  const [isLoading, setIsLoading] = useState(false);
  // Dữ liệu tổng cho công việc
  // 1. Lấy loại công việc
  let typeUpdate;
  typess.forEach(e => {
    if (e.label == type) typeUpdate = e
  });


  // Form sửa thông tin
  const fields = [
    {
      type: 'input',
      name: 'name',
      label: 'Tên công việc',
      defaultValue: data.name,
      required: true,
    },
    {
      type: 'select',
      name: 'taskCategory',
      label: 'Loại công việc',
      required: true,
      defaultValue: typeUpdate.value,
      options: typess,
    },
    {
      type: 'select',
      name: 'doer',
      label: 'Người thực hiện',
      required: true,
      defaultValue: data.doer,
      options: doers,
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Thời gian bắt đầu',
      defaultValue: data.startDate.split('T')[0],
      required: true,
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Thời gian kết thúc',
      defaultValue: data.endDate.split('T')[0],
      required: true,
    },
    {
      type: 'textarea',
      name: 'detail',
      label: 'Chi tiết công việc',
      defaultValue: data.detail,
      required: true,
    },
    {
      type: 'textarea',
      name: 'notes',
      defaultValue: data.notes,
      label: 'Ghi chú',
    },
  ];

  const create_t = [

    {
      type: 'input',
      name: 'name',
      label: 'Tên công việc',
      defaultValue: data.name,
      required: true,
    },
    {
      type: 'select',
      name: 'taskCategory',
      label: 'Loại công việc',
      required: true,
      defaultValue: typeUpdate.value,
      options: typess,
    },
    {
      type: 'select',
      name: 'doer',
      label: 'Người thực hiện',
      required: true,
      defaultValue: data.doer,
      options: doers,
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Thời gian bắt đầu',
      defaultValue: data.startDate.split('T')[0],
      required: true,
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Thời gian kết thúc',
      defaultValue: data.endDate.split('T')[0],
      required: true,
    },
    {
      type: 'textarea',
      name: 'detail',
      label: 'Chi tiết công việc',
      defaultValue: data.detail,
      required: true,
    },
    {
      type: 'textarea',
      name: 'notes',
      defaultValue: data.notes,
      label: 'Ghi chú',
    },
  ];

  const handleSave_t = async (datas) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/Task_create_clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId: data._id, subTask: datas, source: 1 }),
      });
      setIsLoading(false);
      if (response.ok) {

      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  }
  const handleSave = async (datas) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(datas),
      });
      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const checkDone = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}/doer-done`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const checkerDone = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}/checker-done`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const sendMes = async () => {
    setIsLoading(true)
    let url = `https://script.google.com/macros/s/AKfycbx8gtYOEkSLSZf6IBEeDyg8bSnBA0FoV1VQcnUavejJL8Ue0dGf9OKbaGuOvXoSEmKTYQ/exec?name=${data.name}&project=${projects}&detail=${data.detail}&doer=${sendname.Name}&notes=${data.notes}&doerDone=${data.doerDone}&checkerDone=${data.checkerDone}&linkDrive=https://drive.google.com/drive/folders/${data.linkDrive}`
    try {
      const response = await fetch(`${url}`);
      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  }

  const deleteTask = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setIsLoading(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'var(--background_1)',
          textDecoration: 'none',
          backgroundColor: data.checkerDone ? '#d2ffd2' : 'unset',
          transition: 'all .2s linear',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: data.checkerDone ? '#b2efb2' : 'var(--background)',
          },
        }}
      >
        <div style={{ padding: '16px 0 16px 16px ', display: 'flex', flex: 7.4 }} onClick={openSubTask}>
          <Box sx={{ flex: '1', display: 'flex', alignItems: 'center' }}>
            <p>{projects}</p>
          </Box>
          <Box sx={{ flex: '2', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{data.name}</p>
          </Box>
          <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p>{startDate}</p>
          </Box>
          <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p>{endDate}</p>
          </Box>
          <Box sx={{ flex: '.9', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p>{type}</p>
          </Box>
          <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p>{users}</p>
          </Box>
        </div>
        <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)', justifyContent: 'center', fontWeight: '500', gap: 1, pr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'var(--text)', justifyContent: 'center' }}>
            <Tooltip title="Hoàn thành" onClick={checkDone}>
              <div className={data.Check ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'} >
                <AssignmentTurnedInRoundedIcon fontSize="small" sx={{ color: data.doerDone ? 'green' : 'unset' }} />
              </div>
            </Tooltip>
            <Tooltip title="Được duyệt" onClick={checkerDone}>
              <div className={data.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'} >
                <LibraryAddCheckRoundedIcon fontSize="small" sx={{ color: data.checkerDone ? 'green' : 'unset' }} />
              </div>
            </Tooltip>
            <Tooltip title="Gửi thông báo" onClick={sendMes}>
              <div className={'iconWrap flexCenter'} >
                <EmailIcon fontSize="small" />
              </div>
            </Tooltip>
          </Box>
          <Tooltip title="Hành động">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={openDetail}>
              <ListItemIcon>
                <InfoRoundedIcon fontSize="small" />
              </ListItemIcon>
              Xem chi tiết
            </MenuItem>
            <Popup_Form
              button={<MenuItem sx={{ width: '100%' }}>
                <ListItemIcon>
                  <BorderColorRoundedIcon fontSize="small" />
                </ListItemIcon>
                Sửa công việc
              </MenuItem>}
              title="Sửa thông tin công việc"
              fields={fields}
              onSave={handleSave}
            />
            <Popup_Form button={
              <MenuItem sx={{ width: '100%' }}>
                <ListItemIcon>
                  <AddBoxIcon fontSize="small" />
                </ListItemIcon>
                Tạo công việc con
              </MenuItem>}
              title="Tạo công việc con"
              fields={create_t}
              onSave={handleSave_t}
            />
            <Divider />
            <MenuItem onClick={deleteTask} sx={{ color: '#b01b1b' }}>
              <ListItemIcon>
                <DeleteRoundedIcon sx={{ color: '#b01b1b' }} fontSize="small" />
              </ListItemIcon>
              Xóa công việc
            </MenuItem>
          </Menu>
        </Box>
      </Box >

      {/* Danh sách công việc con */}
      {subTask ?
        <Box sx={{ mb: 1, border: 'thin solid black' }}>
          {data.subTask.map(t => (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'var(--background_1)',
                textDecoration: 'none',
                backgroundColor: data.checkerDone ? '#d2ffd2' : 'unset',
                transition: 'all .2s linear',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: data.checkerDone ? '#b2efb2' : 'var(--background)',
                },
              }}
            >
              {/* Thông tin cơ bản của công việc con */}
              <div style={{ padding: '8px 0 8px 16px ', display: 'flex', flex: 7.4 }} onClick={openSubTask}>
                <Box sx={{ flex: '1', display: 'flex', alignItems: 'center' }}> <p>{projects}</p> </Box>
                <Box sx={{ flex: '2', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                  <p style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{t.name}</p>
                </Box>
                <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                  <p>{startDate}</p>
                </Box>
                <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                  <p>{endDate}</p>
                </Box>
                <Box sx={{ flex: '.9', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                  <p>{type}</p>
                </Box>
                <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                  <p>{users}</p>
                </Box>
                <Box sx={{ flex: '.7', display: 'flex', alignItems: 'center', color: 'var(--text)', justifyContent: 'center' }}>
                  <Tooltip title="Hoàn thành">
                    <div className={t.Check ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'} >
                      <AssignmentTurnedInRoundedIcon fontSize="small" sx={{ color: t.doerDone ? 'green' : 'unset' }} />
                    </div>
                  </Tooltip>
                  <Tooltip title="Được duyệt">
                    <div className={t.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'} >
                      <LibraryAddCheckRoundedIcon fontSize="small" sx={{ color: t.checkerDone ? 'green' : 'unset' }} />
                    </div>
                  </Tooltip>
                </Box>
              </div>
              {/* Menu cho công việc con */}
              <Box sx={{ flex: '.3', display: 'flex', alignItems: 'center', color: 'var(--text)', justifyContent: 'center', fontWeight: '500', gap: 1, pr: 2 }}>
                <Tooltip title="Hành động">
                  <IconButton
                    onClick={handleClick1}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorE2={anchorE2}
                  id="account-menu"
                  open={open1}
                  onClose={handleClose1}
                  slotProps={{
                    paper: {
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&::before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={openDetail}>
                    <ListItemIcon>
                      <InfoRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Xem chi tiết
                  </MenuItem>
                  <Popup_Form
                    button={<MenuItem sx={{ width: '100%' }}>
                      <ListItemIcon>
                        <BorderColorRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      Sửa công việc
                    </MenuItem>}
                    title="Sửa thông tin công việc"
                    fields={fields}
                    onSave={handleSave}
                  />
                  <MenuItem onClick={checkDone}>
                    <ListItemIcon>
                      <AssignmentTurnedInRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Xác nhận hoàn thành
                  </MenuItem>
                  <MenuItem onClick={checkerDone}>
                    <ListItemIcon>
                      <LibraryAddCheckRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Kiểm duyệt công việc
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={deleteTask} sx={{ color: '#b01b1b' }}>
                    <ListItemIcon>
                      <DeleteRoundedIcon sx={{ color: '#b01b1b' }} fontSize="small" />
                    </ListItemIcon>
                    Xóa công việc
                  </MenuItem>
                </Menu>
              </Box>
            </Box >))
          }
        </Box>
        : null}

      {/* Load màn hình */}
      <Dialog fullWidth maxWidth={'md'} open={detail} onClose={detailClose}  >
        <Task_Detail projectName={projects} taskType={type} startDate={startDate} endDate={endDate} checkerName={users} data={data} />
      </Dialog >
      {/* Load màn hình */}
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

// Giao diện chi tiết công việc
export function Task_Detail({ data, projectName, taskType, startDate, endDate, checkerName, }) {
  return (
    <>
      <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>
        Công việc thuộc dự án {projectName}</Box>
      <Box sx={{ p: 2, bgcolor: 'var(--background)', pt: 1, maxHeight: '80vh' }} >
        <div style={{ flex: 1 }}>
          <p className="Title_Popup" style={{ padding: '4px 0 12px 0' }}>Thông tin</p>
          <div style={{
            display: 'flex', gap: 8, flexDirection: 'column', padding: 12,
            border: 'thin solid var(--background_1)', borderRadius: 3, background: 'white'
          }}>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Công việc:</p> {projectName}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Chi tiết công việc: <span className='text_3' style={{ fontWeight: 400 }}>{data.detail} </span></p> </div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Loại công việc:</p> {taskType}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Thời gian thực hiện: </p>{startDate == endDate ? startDate : `${startDate} - ${startDate}`}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Trạng thái hoàn thành: </p>{data.doerDone ? 'Hoàn thành' : 'Chưa hoàn thành'}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Trạng thái kiểm duyệt: </p>{data.checkerDone ? 'Đã duyệt' : 'Chưa duyệt'}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Người kiểm duyệt:</p> {checkerName}</div>
            <div style={{ display: 'flex', gap: 8 }}><p className='text_3' style={{ fontWeight: 500 }}>Ghi chú: </p>{data.notes}</div>
          </div>
        </div>
        <p className="Title_Popup" style={{ margin: '12px 0 12px 0' }}>Tài nguyên</p>
        <Link href={`https://drive.google.com/drive/folders/${data.linkDrive}`} target='_blank'>
          <div style={{
            display: 'flex', gap: 8, padding: 12,
            border: 'thin solid var(--background_1)', borderRadius: 3, background: 'white', width: 'calc(100% - 24px)'
          }}>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: .5,
            }}>
              <img
                src='https://assets.minimals.cc/public/assets/icons/apps/ic-app-drive.svg'
                alt='dsds'
                loading="lazy"
              />
              <Box>{projectName} - {data.name}</Box>
            </Box>

          </div>
        </Link>
      </Box>
    </>
  )
}
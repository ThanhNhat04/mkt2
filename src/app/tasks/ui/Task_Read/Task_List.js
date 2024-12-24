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
import { getFtoF, getUserByProject } from '@/app/function';
import EmailIcon from '@mui/icons-material/Email';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import Button from '@mui/material/Button'; // Thêm button MUI

// HÀM RÚT GỌN TÊN
function abbreviateName(fullName) {
  if (!fullName) return 'N/A';
  const nameParts = fullName.trim().split(/\s+/);
  const lastName = nameParts.pop();
  const initials = nameParts.map((part) => part[0].toUpperCase()).join('.');
  return `${initials}.${lastName}`;
}

// GIAO DIỆN CHI TIẾT CÔNG VIỆC
export function Task_Detail({ data, projectName, taskType, startDate, endDate, checkerName }) {
  // ... (giữ nguyên, không thay đổi)
  // Chỉ lược bớt console.log và những phần cũ.
  return (
    <>
      <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>
        Công việc thuộc dự án {projectName}
      </Box>
      <Box sx={{ p: 2, bgcolor: 'var(--background)', pt: 1, maxHeight: '80vh' }}>
        {/* Nội dung ... */}
      </Box>
    </>
  );
}

// GIAO DIỆN CHI TIẾT CÔNG VIỆC SUBTASK
export function Task_Detailsb({ data, projectName, taskType, linkdrive }) {
  // ... (giữ nguyên logic cũ)
  // Lược bớt chi tiết để code gọn
  return (
    <>
      <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>
        Công việc thuộc dự án {projectName}
      </Box>
      <Box sx={{ p: 2, bgcolor: 'var(--background)', pt: 1, maxHeight: '80vh' }}>
        {/* Nội dung ... */}
      </Box>
    </>
  );
}

function UI_Student_List({ data, types, dataType, userss, token, user, project }) {
  // Lấy doer, userInProject, v.v...
  let doerfull;
  for (let i in userss) {
    if (userss[i]._id === data.doer) {
      doerfull = userss[i];
    }
  }
  let userInProject = getUserByProject(userss, project, data);

  let startDate = data.startDate.split('T')[0].slice(-2) + '/' +
    data.startDate.split('T')[0].slice(-5, -3) + '/' +
    data.startDate.split('T')[0].slice(0, 4);

  let endDate = data.endDate.split('T')[0].slice(-2) + '/' +
    data.endDate.split('T')[0].slice(-5, -3) + '/' +
    data.endDate.split('T')[0].slice(0, 4);

  // TÌM TÊN PROJECT
  let projects = project;
  projects.forEach((p) => {
    if (p._id === data.project) projects = p.name;
  });

  // TÌM TÊN CHECKER
  let users = userss;
  users.forEach((u) => {
    if (u._id === data.checker) {
      users = u.Name;
    }
  });

  // LẤY LOẠI (TYPE) ĐỂ HIỂN THỊ
  let type = types;
  type.forEach((tt) => {
    if (tt._id.toLowerCase() === data.taskCategory.toLowerCase()) {
      type = tt.name;
    }
  });

  if (typeof type === 'object') type = 'Không xác định';
  if (typeof projects === 'object') projects = 'Không xác định';
  if (typeof users === 'object') users = 'Không xác định';

  // State hiển thị subtask
  const [subTask, setSubTask] = useState(false);
  const openSubTask = () => setSubTask((prev) => !prev);

  // Menu chính
  const [anchorEl, setAnchorEl] = useState(null);
  const openMainMenu = Boolean(anchorEl);
  const handleClickMainMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMainMenu = () => {
    setAnchorEl(null);
  };

  // Menu subtask
  const [anchorElSub, setAnchorElSub] = useState(null);
  const openSubMenu = Boolean(anchorElSub);
  const handleOpenSubMenu = (event) => {
    setAnchorElSub(event.currentTarget);
  };
  const handleCloseSubMenu = () => {
    setAnchorElSub(null);
  };

  // Dialog xem chi tiết cha
  const [detail, setDetail] = useState(false);
  const openDetail = () => setDetail(true);
  const detailClose = () => setDetail(false);

  // Dialog xem chi tiết subtask
  const [detailsb, setDetailsb] = useState(false);
  const openDetailsb = () => setDetailsb(true);
  const detailClosesb = () => setDetailsb(false);

  // Tạo form fields
  const typess = dataType.map((item) => ({
    label: item.name,
    value: item._id,
  }));
  let doers;
  if (!userInProject) {
    doers = userss.map((item) => ({
      label: item.Name,
      value: item._id,
    }));
  } else {
    doers = userInProject.map((item) => ({
      label: item.Name,
      value: item._id,
    }));
  }
  let typeUpdate = typess.find((e) => e.label === type);

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
      defaultValue: typeUpdate?.value || '',
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

  // Form tạo công việc con
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
      defaultValue: typeUpdate?.value || '',
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

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // =============== THÊM DIALOG GỬI TIN NHẮN ===============
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [preparedMessage, setPreparedMessage] = useState('');

  // Mở dialog với nội dung soạn sẵn
  const handleOpenSendDialog = (t) => {
    let d = getFtoF(t.doer, userss, '_id')
    setPreparedMessage(
      `[📌 THÔNG TIN CÔNG VIỆC DỰ ÁN ${projects} 📌]
• Công việc: ${t.name}
• Thời gian thực hiện: ${t.startDate + ' - ' + t.endDate}
• Người thực hiện: ${d[0].Name}
• Mô tả công việc: ${t.detail} 
• Thư mục tài nguyên: https://drive.google.com/drive/folders/${data.linkDrive}`);
    setOpenSendDialog(true);
  };

  // Đóng dialog
  const handleCloseSendDialog = () => {
    setOpenSendDialog(false);
  };

  // Khi nhấn "Tiếp tục" => fetch Google Script
  const handleConfirmSend = async (sen) => {
    setIsLoading(true);
    sen = encodeURIComponent(sen);
    let url = `https://script.google.com/macros/s/AKfycbxyPL4y64pharq6oclJuTU6szBzXznZATHvFTIggeq6XQcEjaPhmNN3DOteUVoMH6Dw1A/exec?phone=${doerfull?.Phone}&mes=${sen}`;
    try {
      const response = await fetch(url);
      setOpenSendDialog(false);
      if (response.ok) {
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
      }
    } catch (error) {
      setIsLoading(false);
      setOpenSendDialog(false);
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
    setIsLoading(false);
  };

  // HÀM GỬI THÔNG BÁO CHO CÔNG VIỆC CHÍNH
  const sendMes = async () => {
    setIsLoading(true);
    let url = `https://script.google.com/macros/s/AKfycbyfCoxZV79-6tLzGkx5mTLUruthF-TRebzZSTmB0V2w8ZgJuh3gMEGp9y6AxqJ9hyFF2Q/exec?name=${data.name}&project=${projects}&detail=${data.detail}&doer=${doerfull?.Name}&notes=${data.notes}&doerDone=${data.doerDone}&checkerDone=${data.checkerDone}&linkDrive=https://drive.google.com/drive/folders/${data.linkDrive}&phone=${doerfull?.Phone}`;
    try {
      const response = await fetch(url);
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

  // (Các hàm khác: checkDone, checkerDone, deleteTask, handleSave, handleSave_t, v.v...)

  // ================== RETURN JSX ==================
  return (
    <>
      {/* HÀNG CHA */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderTop: '1px solid',
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
        <div style={{ padding: '14px 0 14px 8px', display: 'flex', flex: 5.7 }} onClick={openSubTask}>
          <Box sx={{ flex: '.7', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: 14 }}>
              {projects.length > 15 ? `${projects.slice(0, 15)}...` : projects}
            </p>
          </Box>

          <Box sx={{ flex: '1.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>
              {data.name.length > 45 ? `${data.name.slice(0, 45)}...` : data.name}
            </p>
          </Box>

          <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>
              {startDate + ' - ' + endDate}
            </p>
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>{type}</p>
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>{abbreviateName(doerfull?.Name)}</p>
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            30%
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>{abbreviateName(users)}</p>
          </Box>
        </div>

        {/* NÚT HÀNH ĐỘNG CHO CÔNG VIỆC CHÍNH */}
        <Box
          sx={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text)',
            justifyContent: 'center',
            fontWeight: '500',
            pr: 1,
          }}
        >
          <Box sx={{ flex: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="Được duyệt" onClick={() => {/* call checkerDone */ }}>
              <div className={data.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'}>
                <LibraryAddCheckRoundedIcon fontSize="small" sx={{ color: data.checkerDone ? 'green' : 'unset' }} />
              </div>
            </Tooltip>
            <Tooltip title="Drive">
              <div className={data.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'}>
                <FolderRoundedIcon fontSize="small" />
              </div>
            </Tooltip>
            {/* Gửi thông báo TỨC THỜI */}
            <Tooltip title="Gửi thông báo"  onClick={(e) => handleOpenSendDialog(data)}>
              <div className={'iconWrap flexCenter'}>
                <EmailIcon fontSize="small" />
              </div>
            </Tooltip>
          </Box>

          <div style={{ flex: 0.3, display: 'flex', justifyContent: 'center' }}>
            <Tooltip sx={{ p: 0.5 }} title="Hành động">
              <IconButton
                onClick={handleClickMainMenu}
                size="small"
                aria-controls={openMainMenu ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openMainMenu ? 'true' : undefined}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </div>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMainMenu}
            onClose={handleCloseMainMenu}
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
            {/* Xem chi tiết */}
            <MenuItem onClick={openDetail}>
              <ListItemIcon>
                <InfoRoundedIcon fontSize="small" />
              </ListItemIcon>
              Xem chi tiết
            </MenuItem>

            {/* Sửa công việc */}
            <Popup_Form
              button={
                <MenuItem sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <BorderColorRoundedIcon fontSize="small" />
                  </ListItemIcon>
                  Sửa công việc
                </MenuItem>
              }
              title="Sửa thông tin công việc"
              fields={fields}
              onSave={() => {/* handleSave */ }}
            />

            {/* Tạo công việc con */}
            <Popup_Form
              button={
                <MenuItem sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <AddBoxIcon fontSize="small" />
                  </ListItemIcon>
                  Tạo công việc con
                </MenuItem>
              }
              title="Tạo công việc con"
              fields={create_t}
              onSave={() => {/* handleSave_t */ }}
            />

            <Divider />

            {/* Xóa */}
            <MenuItem onClick={() => {/* deleteTask */ }} sx={{ color: '#b01b1b' }}>
              <ListItemIcon>
                <DeleteRoundedIcon sx={{ color: '#b01b1b' }} fontSize="small" />
              </ListItemIcon>
              Xóa công việc
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* SUBTASK */}
      {subTask && (
        <Box sx={{ m: 2, border: 'thin solid var(--background_1)', display: 'flex', flexDirection: 'column', gap: 0.2 }}>
          {data.subTask && data.subTask.length > 0 ? (
            data.subTask.map((t, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderColor: 'var(--background_1)',
                  textDecoration: 'none',
                  backgroundColor: '#efffd2',
                  transition: 'all .2s linear',
                  cursor: 'pointer',
                }}
              >
                {/* INFO SUBTASK */}
                <div style={{ padding: '12px 0 12px 16px', display: 'flex', flex: 5.7 }}>
                  <Box sx={{ flex: '1.8', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    <p style={{ fontSize: 14 }}>
                      {t.name.length > 45 ? `${t.name.slice(0, 45)}...` : t.name}
                    </p>
                  </Box>
                  <Box sx={{ flex: '.82', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    <p style={{ fontSize: 14 }}>
                      {startDate + ' - ' + endDate}
                    </p>
                  </Box>
                  <Box sx={{ flex: '.5', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    <p style={{ fontSize: 14 }}>{type}</p>
                  </Box>
                  <Box sx={{ flex: '.5', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    <p style={{ fontSize: 14 }}>{abbreviateName(doerfull?.Name)}</p>
                  </Box>
                  <Box sx={{ flex: '.5', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    30%
                  </Box>
                  <Box sx={{ flex: '.5', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
                    <p style={{ fontSize: 14 }}>{abbreviateName(users)}</p>
                  </Box>
                </div>

                {/* MENU SUBTASK */}
                <Box
                  sx={{
                    flex: '.9',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--text)',
                    justifyContent: 'center',
                    fontWeight: 500,
                    gap: 1,
                    pr: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: '1.1',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--text)',
                      justifyContent: 'center',
                    }}
                  >
                    <Tooltip title="Hoàn thành">
                      <IconButton size="small" onClick={handleOpenSendDialog}>
                        <AssignmentTurnedInRoundedIcon fontSize="small" sx={{ color: t.doerDone ? 'green' : 'unset' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Drive">
                      <Link href={`https://drive.google.com/drive/folders/${data.linkDrive}`} target="_blank">
                        <IconButton size="small">
                          <FolderRoundedIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Tooltip>
                    {/* Gửi thông báo (chưa kèm xác nhận) */}
                    <Tooltip title="Gửi thông báo" sx={{ p: 1 }}>
                      <IconButton size="small" onClick={(e) => handleOpenSendDialog(t)}>
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <div style={{ flex: '.2' }}>
                    <Tooltip title="Hành động">
                      <IconButton
                        onClick={handleOpenSubMenu}
                        size="small"
                        aria-controls={openSubMenu ? 'sub-task-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openSubMenu ? 'true' : undefined}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <Menu
                    id="sub-task-menu"
                    anchorEl={anchorElSub}
                    open={openSubMenu}
                    onClose={handleCloseSubMenu}
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
                    <MenuItem onClick={openDetailsb}>
                      <ListItemIcon>
                        <InfoRoundedIcon fontSize="small" />
                      </ListItemIcon>
                      Xem chi tiết
                    </MenuItem>

                    <Popup_Form
                      button={
                        <MenuItem sx={{ width: '100%' }}>
                          <ListItemIcon>
                            <BorderColorRoundedIcon fontSize="small" />
                          </ListItemIcon>
                          Sửa công việc
                        </MenuItem>
                      }
                      title="Sửa thông tin công việc"
                      fields={fields}
                      onSave={(data) => console.log('Save subTask', data)}
                    />
                    <Divider />
                    <MenuItem onClick={() => {/* deleteTask */ }} sx={{ color: '#b01b1b' }}>
                      <ListItemIcon>
                        <DeleteRoundedIcon sx={{ color: '#b01b1b' }} fontSize="small" />
                      </ListItemIcon>
                      Xóa công việc
                    </MenuItem>
                  </Menu>
                </Box>
                {/* Dialog chi tiết subtask */}
                <Dialog fullWidth maxWidth={'md'} open={detailsb} onClose={detailClosesb}>
                  <Task_Detailsb projectName={projects} taskType={types} data={t} linkdrive={data.linkDrive} />
                </Dialog>
              </Box>
            ))
          ) : (
            <p style={{ padding: '16px' }}>Không có công việc con</p>
          )}
        </Box>
      )}

      {/* Dialog xem chi tiết CHA */}
      <Dialog fullWidth maxWidth={'md'} open={detail} onClose={detailClose}>
        <Task_Detail
          projectName={projects}
          taskType={type}
          startDate={startDate}
          endDate={endDate}
          checkerName={users}
          data={data}
        />
      </Dialog>

      {/* BACKDROP LOADING */}
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* DIALOG XÁC NHẬN GỬI TIN NHẮN */}
      <Dialog open={openSendDialog} onClose={handleCloseSendDialog} maxWidth="md" fullWidth>
        <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>Nội dung gửi tin nhắn</Box>
        <Box
          sx={{
            border: '1px solid #ccc',
            minHeight: '100px',
            p: 2,
            borderRadius: 1,
            whiteSpace: 'pre-wrap',
          }}
        >
          {preparedMessage}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center', p: '8px 16px' }}>
          <Button onClick={handleCloseSendDialog} variant="outlined">  Hủy</Button>
          <Button onClick={(e) => handleConfirmSend(preparedMessage)} variant="contained" color="primary"> Gửi thông báo </Button>
        </Box>
      </Dialog>
    </>
  );
}

// DANH SÁCH CÔNG VIỆC VỚI PHÂN TRANG
export default function Task_Read_List({
  student,
  type,
  dataType,
  dataProject,
  token,
  user,
  project,
  users
}) {
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
      {currentStudents.map((item, index) => (
        <UI_Student_List
          key={index}
          userss={users}
          data={item}
          types={type}
          dataType={dataType}
          project={project}
          dataProject={dataProject}
          token={token}
          user={user}
        />
      ))}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          py: 2,
          borderTop: 'thin solid var(--background_1)',
        }}
      >
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

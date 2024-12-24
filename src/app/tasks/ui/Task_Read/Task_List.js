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
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

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
  console.log(data);
  
  return (
    <>
      <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>
        Công việc thuộc dự án {projectName}
      </Box>
      <Box sx={{ p: 2, bgcolor: 'var(--background)', pt: 1, maxHeight: '80vh' }}>
        <div style={{ flex: 1 }}>
          <p className="Title_Popup" style={{ padding: '4px 0 12px 0' }}>Thông tin</p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexDirection: 'column',
              padding: 12,
              border: 'thin solid var(--background_1)',
              borderRadius: 3,
              background: 'white'
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Công việc:</p> {projectName}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Loại công việc:</p> {taskType}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Thời gian thực hiện: </p>
              {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Trạng thái hoàn thành:</p>
              {data.doerDone ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Trạng thái kiểm duyệt:</p>
              {data.checkerDone ? 'Đã duyệt' : 'Chưa duyệt'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Người kiểm duyệt:</p> {checkerName}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Ghi chú:</p> {data.notes}
            </div>
          </div>
        </div>
        <p className="Title_Popup" style={{ padding: '12px 0 12px 0' }}>Chi tiết công việc</p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexDirection: 'column',
            padding: 12,
            border: 'thin solid var(--background_1)',
            borderRadius: 3,
            background: 'white'
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div className='text_3' style={{ fontWeight: 500 }}>
              Chi tiết công việc:
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  width: '100%',
                  overflowWrap: 'break-word',
                  padding: '10px',
                  lineHeight: '1.5'
                }}
              >
                {data.detail}
              </div>
            </div>
          </div>
        </div>
        <p className="Title_Popup" style={{ margin: '12px 0 12px 0' }}>Tài nguyên</p>
        <Link href={`https://drive.google.com/drive/folders/${data.linkDrive}`} target='_blank' sx={{ mb: 12 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: 12,
              border: 'thin solid var(--background_1)',
              borderRadius: 3,
              background: 'white',
              width: 'calc(100% - 24px)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 0.5,
              }}
            >
              <img
                src='https://assets.minimals.cc/public/assets/icons/apps/ic-app-drive.svg'
                alt='drive-icon'
                loading="lazy"
              />
              <Box>{projectName} - {data.name}</Box>
            </Box>
          </div>
        </Link>
      </Box>
    </>
  );
}

// GIAO DIỆN CHI TIẾT CÔNG VIỆC SUBTASK
export function Task_Detailsb({ data, projectName, taskType, linkdrive }) {
  
  let type = taskType;
  type.forEach((tt) => {
    if (tt._id.toLowerCase() === data.taskCategory.toLowerCase()) {
      type = tt.name;
    }
  });

  return (
    <>
      <Box className="Title_Popup" sx={{ p: 2, borderBottom: 'thin solid var(--background_1)' }}>
        Công việc thuộc dự án {projectName}
      </Box>
      <Box sx={{ p: 2, bgcolor: 'var(--background)', pt: 1, maxHeight: '80vh' }}>
        <div style={{ flex: 1 }}>
          <p className="Title_Popup" style={{ padding: '4px 0 12px 0' }}>Thông tin</p>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexDirection: 'column',
              padding: 12,
              border: 'thin solid var(--background_1)',
              borderRadius: 3,
              background: 'white'
            }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Công việc:</p> {data.name}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Loại công việc:</p> {type}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Thời gian thực hiện: </p>
              {data.startDate === data.endDate ? data.startDate : `${data.startDate} - ${data.endDate}`}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Trạng thái hoàn thành:</p>
              {data.doerDone ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <p className='text_3' style={{ fontWeight: 500 }}>Ghi chú:</p> {data.notes}
            </div>
          </div>
        </div>
        <p className="Title_Popup" style={{ padding: '12px 0 12px 0' }}>Chi tiết công việc</p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexDirection: 'column',
            padding: 12,
            border: 'thin solid var(--background_1)',
            borderRadius: 3,
            background: 'white'
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div className='text_3' style={{ fontWeight: 500 }}>
              Chi tiết công việc:
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  width: '100%',
                  overflowWrap: 'break-word',
                  padding: '10px',
                  lineHeight: '1.5'
                }}
              >
                {data.detail}
              </div>
            </div>
          </div>
        </div>
        <p className="Title_Popup" style={{ margin: '12px 0 12px 0' }}>Tài nguyên</p>
        <Link href={`https://drive.google.com/drive/folders/${linkdrive }`} target='_blank' sx={{ mb: 12 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: 12,
              border: 'thin solid var(--background_1)',
              borderRadius: 3,
              background: 'white',
              width: 'calc(100% - 24px)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 0.5,
              }}
            >
              <img
                src='https://assets.minimals.cc/public/assets/icons/apps/ic-app-drive.svg'
                alt='drive-icon'
                loading="lazy"
              />
              <Box>{projectName} - {data.name}</Box>
            </Box>
          </div>
        </Link>
      </Box>
    </>
  );
}

function UI_Student_List({ data, types, dataType, userss, token, user, project }) {
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

  // NẾU KHÔNG TÌM THẤY => GÁN 'Không xác định'
  if (typeof type === 'object') type = 'Không xác định';
  if (typeof projects === 'object') projects = 'Không xác định';
  if (typeof users === 'object') users = 'Không xác định';

  // STATE HIỂN THỊ SUBTASK
  const [subTask, setSubTask] = useState(false);
  const openSubTask = () => setSubTask((prev) => !prev);

  // =========== MENU CHO CÔNG VIỆC CHÍNH ===========
  const [anchorEl, setAnchorEl] = useState(null);
  const openMainMenu = Boolean(anchorEl);

  const handleClickMainMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMainMenu = () => {
    setAnchorEl(null);
  };

  // =========== MENU CHO SUBTASK ===========
  const [anchorElSub, setAnchorElSub] = useState(null);
  const openSubMenu = Boolean(anchorElSub);

  const handleOpenSubMenu = (event) => {
    setAnchorElSub(event.currentTarget);
  };
  const handleCloseSubMenu = () => {
    setAnchorElSub(null);
  };

  // STATE HIỂN THỊ CHI TIẾT
  const [detail, setDetail] = useState(false);
  const openDetail = () => setDetail(true);
  const detailClose = () => setDetail(false);

  // STATE HIỂN THỊ CHI TIẾT SUBTASK
  const [detailsb, setDetailsb] = useState(false);
  const openDetailsb = () => setDetailsb(true);
  const detailClosesb = () => setDetailsb(false);


  // TẠO MẢNG LỰA CHỌN CHO POPUP FORM
  const typess = dataType.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  // TẠO MẢNG CHỌN DOER
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

  // TÌM TYPEUPDATE => MẶC ĐỊNH CHO POPUP FORM
  let typeUpdate = typess.find((e) => e.label === type);


  // FORM SỬA THÔNG TIN
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


  const updateClone = (data) => {
    console.log(data);

  }

  // FORM TẠO CÔNG VIỆC CON
  const create_t = [
    {
      type: 'input',
      name: 'name',
      label: 'Tên công việc',
      defaultValue: data.name, // Cũng có thể để ""
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

  // STATE LOADING
  const [isLoading, setIsLoading] = useState(false);

  // ========== CÁC HÀM GỌI API ==========

  // SỬA CÔNG VIỆC
  const handleSave = async (datas) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // TẠO CÔNG VIỆC CON
  const handleSave_t = async (datas) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/Task_create_clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: data._id,
          subTask: datas,
          source: 1,
        }),
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

  // DOER HOÀN THÀNH
  const checkDone = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}/doer-done`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // CHECKER DUYỆT
  const checkerDone = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}/checker-done`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

  // GỬI THÔNG BÁO
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

  // XÓA CÔNG VIỆC
  const deleteTask = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task/${data._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
        <div
          style={{ padding: '14px 0 14px 8px', display: 'flex', flex: 5.7 }}
          onClick={openSubTask}
        >
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
            <p style={{ fontSize: 14 }}>
              {abbreviateName(doerfull?.Name)}
            </p>
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            30%
          </Box>

          <Box sx={{ flex: '.6', display: 'flex', alignItems: 'center', color: 'var(--text)' }}>
            <p style={{ fontSize: 14 }}>
              {abbreviateName(users)}
            </p>
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
            pr: 1
          }}
        >
          <Box sx={{ flex: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="Được duyệt" onClick={checkerDone}>
              <div className={data.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'}>
                <LibraryAddCheckRoundedIcon
                  fontSize="small"
                  sx={{ color: data.checkerDone ? 'green' : 'unset' }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Drive">
              <div className={data.checkerDone ? 'iconWrap2 flexCenter' : 'iconWrap flexCenter'}>
                <FolderRoundedIcon fontSize="small" />
              </div>
            </Tooltip>
            <Tooltip title="Gửi thông báo" onClick={sendMes}>
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
            <MenuItem onClick={openDetail}>
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
              onSave={handleSave}
            />

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
                <Box sx={{ flex: '.9', display: 'flex', alignItems: 'center', color: 'var(--text)', justifyContent: 'center', fontWeight: 500, gap: 1, pr: 2 }}>
                  <Box
                    sx={{
                      flex: '1.1',
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--text)',
                      justifyContent: 'center'
                    }}
                  >
                    <Tooltip title="Hoàn thành">
                      <IconButton
                        size="small"
                        onClick={() => alert('Xác nhận hoàn thành subTask (tuỳ logic)')}
                      >
                        <AssignmentTurnedInRoundedIcon fontSize="small" sx={{ color: t.doerDone ? 'green' : 'unset' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Được duyệt">
                      <IconButton
                        size="small"
                        onClick={() => alert('Kiểm duyệt subTask (tuỳ logic)')}
                      >
                        <FolderRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gửi thông báo" sx={{ p: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => alert('Gửi thông báo subTask (tuỳ logic)')}
                      >
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
                      onSave={updateClone}
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
                <Dialog fullWidth maxWidth={'md'} open={detailsb} onClose={detailClosesb}>
                  <Task_Detailsb
                    projectName={projects}
                    taskType={types}
                    data={t}
                    linkdrive={data.linkDrive}
                  />
                </Dialog>
              </Box>
            ))
          ) : (
            <p style={{ padding: '16px' }}>Không có công việc con</p>
          )}
        </Box>
      )}

      {/* DIALOG XEM CHI TIẾT */}
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

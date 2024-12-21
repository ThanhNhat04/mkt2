// 'use client';

// import { useState } from 'react';
// import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
// import Box from '@mui/material/Box';
// import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
// import CircularProgress from '@mui/material/CircularProgress';
// import Backdrop from '@mui/material/Backdrop';
// import { getTodayDate, setValueInpue } from '@/app/function';

// export default function Task_Create({ dataType, dataProject, token, user, users, projects }) {
//   let today = getTodayDate()
//   const type = dataType.map(item => ({
//     label: item.name,
//     value: item.id
//   }));

//   const project = dataProject.map(item => ({
//     label: item.name,
//     value: item.id
//   }));


//   let doers = setValueInpue(users, 'Name', '_id')

//   const [isLoading, setIsLoading] = useState(false);

//   const fields = [
//     {
//       type: 'select',
//       name: 'project',
//       label: 'Dự án',
//       required: true,
//       options: project,
//     },
//     {
//       type: 'select',
//       name: 'taskCategory',
//       label: 'Loại công việc',
//       required: true,
//       options: type,
//     },
//     {
//       type: 'select',
//       name: 'doer',
//       label: 'Người thực hiện',
//       required: true,
//       defaultValue: user,
//       options: doers,
//     },
//     {
//       type: 'input',
//       name: 'name',
//       label: 'Tên công việc',
//       required: true,
//     },
//     {
//       type: 'date',
//       name: 'startDate',
//       label: 'Thời gian bắt đầu',
//       defaultValue: today,
//       required: true,
//     },
//     {
//       type: 'date',
//       name: 'endDate',
//       label: 'Thời gian kết thúc',
//       defaultValue: today,
//       required: true,
//     },
//     {
//       type: 'textarea',
//       name: 'detail',
//       label: 'Chi tiết công việc',
//       required: true,
//     },
//     {
//       type: 'textarea',
//       name: 'notes',
//       label: 'Ghi chú',
//     },


//   ];

//   const openai = async () => {
//     const res = await fetch('/api/openAi', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messages: [{
//           role: 'user', content:
//             `Hãy kể tên các loài chó`
//         }]
//       }),
//     });
//     if (!res.ok) {
//       alert('Bạn không có quyền thực hiện tính năng này')
//     } else {
//       const datas = await res.json();
//       setchat(datas.choices[0].message.content)
//       setstatus('Gửi cho phụ huynh')
//     }
//   }

//   const handleSave = async (data) => {
//     data.doer = user
//     data.doerDone = false
//     data.checkerDone = false
//     setIsLoading(true)

//     for (let i in dataProject) {
//       if (dataProject[i].id == data.project) {
//         data.checker = dataProject[i].leader[0]
//       }
//     }

//     // try {
//     //   const response = await fetch('https://todo.tr1nh.net/api/task', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //       'Authorization': `Bearer ${token}`,
//     //     },
//     //     body: JSON.stringify(data),
//     //   });

//     //   setIsLoading(false);

//     //   if (response.ok) {
//     //     window.location.reload();
//     //   } else {
//     //     const errorData = await response.json();
//     //     alert(`Đã xảy ra lỗi: ${errorData.mes || errorData.message || 'Không xác định'}`);
//     //   }
//     // } catch (error) {
//     //   setIsLoading(false);
//     //   alert(`Đã xảy ra lỗi: ${error.message}`);
//     // }
//   };

//   return (
//     <>
//       <Box sx={{ width: 'max-content', height: '100%' }}>
//         <Popup_Form
//           button={
//             <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
//               <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm công việc
//             </div>
//           }
//           title="Tạo công việc"
//           fields={fields}
//           onSave={openai}
//         />
//       </Box>
//       <Backdrop
//         sx={{ color: '#fff', zIndex: 99999 }}
//         open={isLoading}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     </>
//   );
// }

import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, CircularProgress } from '@mui/material';

export default function TaskCreate({ dataProject }) {
  const project = dataProject.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    project: '',
    taskType: '',
    taskName: '',
    startDate: '',
    endDate: '',
    details: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleClickOpen = () => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    setFormData((prev) => ({
      ...prev,
      startDate: today.toISOString().split('T')[0],
      endDate: nextMonth.toISOString().split('T')[0],
    }));

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      project: '',
      taskType: '',
      taskName: '',
      startDate: '',
      endDate: '',
      details: '',
      notes: '',
    });
    setErrors({});
    setAiError('');
  };

  const handleChange = (name) => (event, value) => {
    setFormData({ ...formData, [name]: value || event.target.value });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.taskName) newErrors.taskName = 'Tên công việc là bắt buộc';
    if (!formData.startDate) newErrors.startDate = 'Thời gian bắt đầu là bắt buộc';
    if (!formData.endDate) newErrors.endDate = 'Thời gian kết thúc là bắt buộc';
    if (!formData.project) newErrors.project = 'Dự án là bắt buộc';
    if (!formData.taskType) newErrors.taskType = 'Loại công việc là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      console.log('Saved data:', formData);
      handleClose();
    }
  };

  const fetchAISuggestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/openAi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user', content:
              `Hãy đề xuất các bước cụ thể để thực hiện công việc khoảng 300 kí tự: ${formData.taskName}`
          }]
        }),
      });
      if (!res.ok) {
        alert('Bạn không có quyền thực hiện tính năng này')
      } else {
        const datas = await res.json();
        const suggestion = datas.choices[0].message.content || 'Không có gợi ý từ AI';
        setFormData((prev) => ({ ...prev, details: prev.details + '\n' + suggestion }));
      }
    } catch (error) {
      console.error('Error fetching AI suggestion:', error);
      setAiError('Không thể lấy gợi ý từ AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Tạo công việc
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Tạo công việc</DialogTitle>
        <DialogContent sx={{ minHeight: '500px', minWidth: '800px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              {/* Cột bên trái */}
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ paddingBottom: '14px' }}
                  label="Tên công việc *"
                  name="taskName"
                  value={formData.taskName}
                  variant="filled"
                  onChange={handleChange('taskName')}
                  error={!!errors.taskName}
                  helperText={errors.taskName}
                  required
                  fullWidth
                />
                <Autocomplete
                  sx={{ paddingBottom: '14px' }}
                  options={project}
                  getOptionLabel={(option) => option.label}
                  onChange={handleChange('project')}
                  renderInput={(params) => (
                    <TextField {...params} label="Dự án *" error={!!errors.project} helperText={errors.project} />
                  )}
                  fullWidth
                />
                <Autocomplete
                  sx={{ paddingBottom: '14px' }}
                  options={[{ label: 'Phát triển phần mềm' }, { label: 'Thiết kế UI' }]}
                  getOptionLabel={(option) => option.label}
                  onChange={handleChange('taskType')}
                  renderInput={(params) => (
                    <TextField {...params} label="Loại công việc *" error={!!errors.taskType} helperText={errors.taskType} />
                  )}
                  fullWidth
                />
                <TextField
                  sx={{ paddingBottom: '14px' }}
                  label="Thời gian bắt đầu *"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  sx={{ paddingBottom: '14px' }}
                  label="Thời gian kết thúc *"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  sx={{ paddingBottom: '14px' }}
                  label="Ghi chú"
                  name="notes"
                  value={formData.notes}
                  variant="filled"
                  onChange={handleChange('notes')}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Grid>

              {/* Cột bên phải */}
              <Grid item xs={12} sm={6}>
                <TextField
                  sx={{ paddingBottom: '16px' }}
                  label="Chi tiết công việc *"
                  name="details"
                  value={formData.details}
                  variant="filled"
                  onChange={handleChange('details')}
                  required
                  multiline
                  rows={14}
                  fullWidth
                />
                <Button
                  onClick={fetchAISuggestions}
                  variant="outlined"
                  color="primary"
                  disabled={loading || !formData.taskName}
                >
                  {loading ? <CircularProgress size={24} /> : 'Gợi ý từ AI'}
                </Button>
                {aiError && <p style={{ color: 'red', marginTop: '8px' }}>{aiError}</p>}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Thoát
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
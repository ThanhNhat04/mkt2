'use client'

import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Dialog, TextField, Box } from '@mui/material';
import { getTodayDate } from '@/app/function';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export default function TaskCreate({ dataProject, users, dataType, token, user, projects }) {

  const [isLoading, setIsLoading] = useState(false);
  const [mesE, setMesE] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Danh sách project, type, person
  const project = dataProject.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const type = dataType.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const person = users.map((item) => ({
    label: item.Name,
    value: item._id,
  }));

  // Lấy ngày hôm nay
  const today = getTodayDate();

  // State cho 2 dialog
  const [open, setOpen] = useState(false);  // Dialog Tạo công việc
  const [openx, setOpenx] = useState(false); // Dialog Thông báo

  // Form data
  const [formData, setFormData] = useState({
    doer: user,
    project: '',
    taskCategory: '',
    name: '',
    startDate: today,
    endDate: today,
    detail: '',
    notes: '',
    checker: ''
  });

  // ==============================
  //  1. Mở/đóng Dialog đầu
  // ==============================
  const handleClickOpen = () => {
    setFormData((prev) => ({
      ...prev,
      startDate: today,
      endDate: today,
    }));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form
    setFormData({
      doer: user,
      project: '',
      taskCategory: '',
      name: '',
      startDate: today,
      endDate: today,
      detail: '',
      notes: '',
      checker: ''
    });
    setErrors({});
    setAiError('');
  };

  // ==============================
  //  2. Đóng Dialog Thông báo (thứ 2)
  // ==============================
  const handleClosex = () => {
    setOpenx(false);
  };

  // ==============================
  //  3. Hàm handleChange
  // ==============================
  const handleChange = (name) => (event) => {
    const newValue = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    // Xóa lỗi của trường vừa thay đổi
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  // ==============================
  //  4. Validate form
  // ==============================
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Tên công việc là bắt buộc';
    if (!formData.startDate) newErrors.startDate = 'Thời gian bắt đầu là bắt buộc';
    if (!formData.endDate) newErrors.endDate = 'Thời gian kết thúc là bắt buộc';
    if (!formData.project) newErrors.project = 'Dự án là bắt buộc';
    if (!formData.taskCategory) newErrors.taskCategory = 'Loại công việc là bắt buộc';

    setErrors(newErrors);

    // Nếu có lỗi, set thông báo chung
    if (Object.keys(newErrors).length > 0) {
      setMesE('Bạn chưa điền đủ các thông tin cần thiết để thêm công việc!');
      return false;
    }
    return true;
  };

  // ==============================
  //  5. Lưu (Save)
  // ==============================
  const handleSave = async () => {
    let h;
    for (let i in projects) {
      if (projects[i]._id == formData.project) {
        h = projects[i].leader[0]
        break
      }
    }
    formData.checker = h
    
    if (!validateForm()) {
      setOpenx(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`https://todo.tr1nh.net/api/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleClose();
        window.location.reload();
      } else {
        setMesE('Tạo công việc không thành công!');
        setOpenx(true);
      }
    } catch (error) {
      setMesE('Đã có lỗi xảy ra khi tạo công việc!');
      setOpenx(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================
  //  6. Gọi OpenAI (nếu cần)
  // ==============================
  const fetchAISuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/openAi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Hãy đề xuất các bước cụ thể để thực hiện công việc khoảng 300 kí tự: ${formData.name}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        alert('Bạn không có quyền thực hiện tính năng này');
      } else {
        const datas = await res.json();
        const suggestion = datas.choices[0].message.content || 'Không có gợi ý từ AI';
        setFormData((prev) => ({
          ...prev,
          detail: prev.detail + '\n' + suggestion,
        }));
      }
    } catch (error) {
      setAiError('Không thể lấy gợi ý từ AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút mở dialog tạo công việc */}
      <Button variant="outlined" onClick={handleClickOpen}>
        Tạo công việc
      </Button>

      {/* Dialog đầu: Tạo công việc */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <div
          className="text_2"
          style={{ borderBottom: '2px solid var(--background_1)', padding: 16 }}
        >
          Tạo công việc
        </div>

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '8px 16px', pt: '16px' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {/* Tên công việc */}
              <TextField
                size="small"
                sx={{ paddingBottom: '8px' }}
                label="Tên công việc *"
                name="name"
                value={formData.name}
                variant="filled"
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
              />

              {/* Loại công việc */}
              <FormControl
                size="small"
                variant="filled"
                fullWidth
                margin="normal"
                sx={{ my: 1 }}
                error={!!errors.taskCategory}
              >
                <InputLabel id="taskType-label">Loại công việc *</InputLabel>
                <Select
                  labelId="taskType-label"
                  label="Loại công việc"
                  value={formData.taskCategory}
                  onChange={handleChange('taskCategory')}
                >
                  {type.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dự án */}
              <FormControl
                size="small"
                variant="filled"
                fullWidth
                margin="normal"
                sx={{ my: 1 }}
                error={!!errors.project}
              >
                <InputLabel id="project-label">Dự án *</InputLabel>
                <Select
                  labelId="project-label"
                  label="Dự án"
                  value={formData.project}
                  onChange={handleChange('project')}
                >
                  {project.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Người thực hiện */}
              <FormControl
                size="small"
                variant="filled"
                fullWidth
                margin="normal"
                sx={{ my: 1 }}
              >
                <InputLabel id="doer-label">Người thực hiện</InputLabel>
                <Select
                  labelId="doer-label"
                  label="Người thực hiện"
                  value={formData.doer}
                  onChange={handleChange('doer')}
                >
                  {person.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Thời gian bắt đầu */}
              <TextField
                variant="filled"
                size="small"
                sx={{ my: 1 }}
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

              {/* Thời gian kết thúc */}
              <TextField
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
                variant="filled"
                size="small"
                sx={{ my: 1 }}
              />

              {/* Ghi chú */}
              <TextField
                label="Ghi chú"
                name="notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                multiline
                rows={2}
                fullWidth
                variant="filled"
                size="small"
                sx={{ my: 1 }}
              />
            </Grid>

            {/* Cột Phải */}
            <Grid item xs={12} sm={6}>
              {/* Nút gọi AI */}
              <Button
                sx={{ mb: '18px' }}
                onClick={fetchAISuggestions}
                variant="outlined"
                color="primary"
                disabled={loading || !formData.name}
              >
                {loading ? <CircularProgress size={24} /> : 'Gợi ý từ AI'}
              </Button>

              {/* Chi tiết công việc */}
              <TextField
                label="Chi tiết công việc *"
                name="details"
                value={formData.detail}
                variant="filled"
                onChange={handleChange('detail')}
                required
                multiline
                rows={16}
                fullWidth
              />
              {aiError && (
                <p style={{ color: 'red', marginTop: '8px' }}>{aiError}</p>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Footer của dialog tạo công việc */}
        <div
          style={{
            borderTop: '2px solid var(--background_1)',
            padding: 16,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <Button onClick={handleClose}>Thoát</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Tạo công việc
          </Button>
        </div>
      </Dialog>

      {/* Dialog sau: Thông báo (chỉ mở khi form chưa đủ hoặc gọi API lỗi) */}
      <Dialog open={openx} onClose={handleClosex} maxWidth="sm" fullWidth>
        <div
          className="text_2"
          style={{ borderBottom: '2px solid var(--background_1)', padding: 16 }}
        >
          Thông báo
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '16px' }}>
          <p className="text_3_m">{mesE}</p>
        </Box>
        <div
          style={{
            borderTop: '2px solid var(--background_1)',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <Button onClick={handleClosex} variant="contained" color="primary">
            Tiếp tục
          </Button>
        </div>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2000 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

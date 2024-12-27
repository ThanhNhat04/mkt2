'use client'

import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Button, Dialog, TextField, Box, Menu, MenuItem } from '@mui/material';
import { getTodayDate } from '@/app/function';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import AddIcon from '@mui/icons-material/Add';
import fetchApi from '@/utils/API_suport/fetchData';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

export default function TaskCreate({ dataProject, users, dataType, token, user, projects, dataFound }) {
  const [selectedF, setSelectedF] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mesE, setMesE] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null); // Dropdown state
  const [prompt, setPrompt] = useState([]); // Prompt state
  const [promptText, setPromptText] = useState(''); // New state for storing prompt text 
  
  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch('api/prompt_get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        const data = await response.json();
        setPrompt(data.data);
      } catch (error) {
        console.error('Error fetching:', error);
      }
    };

    fetchPrompt();
  }, []);

  const handleSelectionChange = (event, value) => {
    setSelectedF(value);
  };
  // Danh sách project, type, person
  const project = dataProject.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const type = dataType.map((item) => ({
    label: item.name,
    value: item._id,
  }));
  const person = users.map((item) => ({
    label: item.Name,
    value: item._id,
  }));

  // Lấy ngày hôm nay
  const today = getTodayDate();
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
        let id = await response.json()
        id = id.data._id
        if (selectedF.length > 0) {
          await fetchApi('/task_create', {
            method: 'POST',
            body: JSON.stringify({ _id: id, foundation: selectedF })
          })
        }
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
  }


  // ==============================
  //  6. Gọi OpenAI (nếu cần)
  // ==============================
  const fetchAISuggestions = async () => {
    setLoading(true);
    try {
        let aiContent = promptText || 'Hãy đề xuất các bước cụ thể để thực hiện công việc khoảng 300 kí tự:';
        // console.log(promptText);
        // if (formData.name) aiContent += ` {name}`;
        // // // if (formData.taskCategory) aiContent += ` {taskCategory}`;
        // // // Convert taskCategory ID to name
        // // const taskCategoryName = dataType.find(item => item._id === formData.taskCategory)?.name || '';
        // // if (taskCategoryName) aiContent += ` {taskCategory}`;

        // if (formData.doer) aiContent += ` {doer}`;
        // if (formData.startDate) aiContent += ` {startDate}`;
        // if (formData.endDate) aiContent += ` {endDate}`;

        // let contentWithValues = aiContent
        //     .replace('{name}', formData.name || '')
        //     .replace('{taskCategory}', formData.taskCategory || '')
        //     .replace('{doer}', formData.doer || '')
        //     .replace('{startDate}', formData.startDate || '')
        //     .replace('{endDate}', formData.endDate || '');

        // console.log(contentWithValues);

        const res = await fetch('/api/openAi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: contentWithValues,
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

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (selectedPrompt) => {
    setPromptText((prev) => prev + '\n' + selectedPrompt.prompt); 
    handleDropdownClose();
  };

  return (
    <>
      <div onClick={handleClickOpen} style={{
        padding: '8px', aspectRatio: 1, height: '100%', border: 'thin solid var(--background_1)'
        , cursor: 'pointer', borderRadius: 6
      }}>
        <AddIcon />
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <div
          className="text_2"
          style={{
            borderBottom: '2px solid var(--background_1)',
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Tạo công việc</span>
          <div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <Button sx={{ mb: '8px', ml: 1 }} variant="outlined" color="primary" onClick={handleDropdownClick}>
                Gợi ý prompt AI cho loại công việc
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
                {prompt.map((item, index) => (
                  <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Menu>
              <Button sx={{ mb: '8px', mr: 5 }} onClick={fetchAISuggestions} variant="outlined" color="primary" disabled={loading || !formData.name}>
                {loading ? <CircularProgress size={24} /> : 'Gợi ý từ AI'}
              </Button>
            </div>
          </div>
        </div>

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '8px 16px', pt: '16px' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3.5}>
              {/* Tên công việc */}
              <TextField size="small" sx={{ paddingBottom: '8px' }} label="Tên công việc *" name="name" value={formData.name} variant="filled" onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} required fullWidth />

              {/* Loại công việc */}
              <FormControl size="small" variant="filled" fullWidth margin="normal" sx={{ my: 1 }} error={!!errors.taskCategory}>
                <InputLabel id="taskType-label">Loại công việc *</InputLabel>
                <Select labelId="taskType-label" label="Loại công việc" value={formData.taskCategory} onChange={handleChange('taskCategory')}>
                  {type.map((t, index) => (
                    <MenuItem key={index} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dự án */}
              <FormControl size="small" variant="filled" fullWidth margin="normal" sx={{ my: 1 }} error={!!errors.project}>
                <InputLabel id="project-label">Dự án *</InputLabel>
                <Select labelId="project-label" label="Dự án" value={formData.project} onChange={handleChange('project')}>
                  {project.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Người thực hiện */}
              <FormControl size="small" variant="filled" fullWidth margin="normal" sx={{ my: 1 }}>
                <InputLabel id="doer-label">Người thực hiện</InputLabel>
                <Select labelId="doer-label" label="Người thực hiện" value={formData.doer} onChange={handleChange('doer')}>
                  {person.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Thời gian bắt đầu */}
              <TextField variant="filled" size="small" sx={{ my: 1 }} label="Thời gian bắt đầu *" name="startDate" type="date" value={formData.startDate} onChange={handleChange('startDate')} error={!!errors.startDate} helperText={errors.startDate} required fullWidth InputLabelProps={{ shrink: true }} />

              {/* Thời gian kết thúc */}
              <TextField label="Thời gian kết thúc *" name="endDate" type="date" value={formData.endDate} onChange={handleChange('endDate')} error={!!errors.endDate} helperText={errors.endDate} required fullWidth InputLabelProps={{ shrink: true }} variant="filled" size="small" sx={{ my: 1 }} />
              <Autocomplete multiple disablePortal options={dataFound} size="small" value={selectedF} onChange={handleSelectionChange} isOptionEqualToValue={(option, value) => option._id === value._id} getOptionLabel={(option) => option.name} renderTags={(tagValue, getTagProps, index) => {
                if (tagValue.length === 0) return null;
                const visibleTag = tagValue[0];
                const remainingCount = tagValue.length - 1;

                return (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Chip size="small" label={visibleTag.name} {...getTagProps({ index: 0 })} />
                    {remainingCount > 0 && (
                      <Chip key={index} size="small" label={`+${remainingCount} nền tảng`} sx={{ backgroundColor: "#ddd", cursor: "pointer", color: '#282828', marginLeft: 2 }} />
                    )}
                  </Box>
                );
              }} renderInput={(params, index) => (
                <TextField {...params} key={index} label="Chọn nền tảng" variant="filled" placeholder="Nhập tên nền tảng..." sx={{ "& .MuiInputBase-root": { height: "57px", width: '100%' } }} />
              )} />
            </Grid>

            {/* Cột Phải */}
            <Grid item xs={12} sm={8.5}>
              {/* Grid container for Prompt and Chi tiết công việc */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {/* Prompt Field */}
                  <TextField 
                    label="Prompt" 
                    name="Prompt" 
                    variant="filled" 
                    onChange={(e) => setPromptText(e.target.value)} 
                    value={promptText} 
                    required 
                    multiline 
                    rows={14.55} 
                    fullWidth 
                  />
                  {aiError && (
                    <p style={{ color: 'red', marginTop: '8px' }}>{aiError}</p>
                  )}
                </Grid>
                
                <Grid item xs={6}>
                  {/* Chi tiết công việc */}
                  <TextField label="Chi tiết công việc *" name="details" value={formData.detail} variant="filled" onChange={handleChange('detail')} required multiline rows={14.55} fullWidth />
                  {aiError && (
                    <p style={{ color: 'red', marginTop: '8px' }}>{aiError}</p>
                  )}
                </Grid>
              </Grid>

              {/* Ghi chú */}
              <TextField label="Ghi chú" name="notes" value={formData.notes} onChange={handleChange('notes')} multiline rows={1.4} fullWidth variant="filled" size="small" sx={{ my: 1 }} />
            </Grid>
          </Grid>
        </Box>

        {/* Footer của dialog tạo c��ng việc */}
        <div style={{ borderTop: '2px solid var(--background_1)', padding: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleClose}>Thoát</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Tạo công việc
          </Button>
        </div>
      </Dialog>
      {/* Dialog sau: Thông báo (chỉ  khi form chưa đủ hoặc gọi API lỗi) */}
      <Dialog open={openx} onClose={handleClosex} maxWidth="sm" fullWidth>
        <div className="text_2" style={{ borderBottom: '2px solid var(--background_1)', padding: 16 }}>
          Thông báo
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: '16px' }}>
          <p className="text_3_m">{mesE}</p>
        </Box>
        <div style={{ borderTop: '2px solid var(--background_1)', padding: '8px 16px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={handleClosex} variant="contained" color="primary">
            Tiếp tục
          </Button>
        </div>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2000 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

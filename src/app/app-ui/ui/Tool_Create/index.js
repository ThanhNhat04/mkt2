'use client';

import { useState, useEffect } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  Snackbar,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';

import {
  AddBoxRounded as AddBoxRoundedIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import MuiAlert from '@mui/material/Alert';
import { Tool_Read_all } from '@/app/data';

export default function Tool_Create({data}) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  const [response, setResponse] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
    // Thêm logic để lọc dự án theo tag ở đây
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSave = async (data) => {
    if (!data.Tool.startsWith('https://') || !data.Image.startsWith('https://')) {
      setOpenSnackbar(true);
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/Tool_create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        setProjects(prevProjects => [...prevProjects, result.data]);
        window.location.reload(); 
      } else {
        console.error(result.mes);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  
    setProjects([...projects, data]);
    setIsLoading(false);
  };

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await Tool_Read_all();
        setResponse(response);
        if (Array.isArray(response)) {
          setTags([...new Set(response.map(task => task.Tag))]);
        } else {
          console.error('No data found in response:', response);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTags();
  }, []);

  const fields = [
    {
      type: 'input',
      name: 'Name',
      label: 'Tên tool',
      required: true,
    },
    {
      type: 'input',
      name: 'Description',
      label: 'Mô tả',
      required: true,
    },
    {
      type: 'input',
      name: 'Image',
      label: 'Đường dẫn hình ảnh',
      required: true,
    },
    {
      type: 'input',
      name: 'Tool',
      label: 'Đường dẫn tool',
      required: true,
    }, {
      type: 'input',
      name: 'Tag',
      label: 'Tag',
      required: true,
    },
  ];

  return (
    <>
        <Card sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Tìm kiếm Tool..."
              value={searchQuery}
              onChange={handleSearch}
              size="small"
              sx={{ minWidth: 300, mr: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              value={selectedTag}
              onChange={handleTagChange}
              displayEmpty
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">
                <em>Tất cả tag</em>
              </MenuItem>
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </Box>
              
          <Box
            sx={{ backgroundColor: 'var(--main)', color: 'white', borderRadius: 1, padding: '10px 12px', display: 'inline-block', textAlign: 'center', height: '100%' }}>
            Tổng số tool: {response ? response.length : 0}
          </Box>

          <Box sx={{ ml: 2 }}>
            <Popup_Form
              button={
                <div className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
                  <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm Tool
                </div>
              }
              title="Tạo dự án"
              fields={fields}
              onSave={handleSave}
            />
          </Box>
        </Card>

      <Backdrop
        sx={{ color: '#fff', zIndex: 99 }}
        open={isLoading} >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Không hợp lệ: Đường dẫn phải bắt đầu bằng "https://".
        </MuiAlert>
      </Snackbar>
    </>
  );
}

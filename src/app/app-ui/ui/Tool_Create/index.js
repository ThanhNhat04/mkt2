'use client';

import { useState, useEffect, useMemo } from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import DeleteButton from '../Tool_Delete';
import Tool_update from '../Tool_Update';
import Image from 'next/image';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SearchIcon from '@mui/icons-material/Search';

import MuiAlert from '@mui/material/Alert';
import { Tool_Read_all } from '@/app/data';

export default function Tool_Create({ data }) {
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
    // Thêm logic lọc tool theo Tag nếu cần
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
        setProjects((prevProjects) => [...prevProjects, result.data]);
        // Reload lại để đồng bộ dữ liệu
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

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const query = searchQuery.toLowerCase();

    return data.filter(tool => {
      const nameLower = tool.Name.toLowerCase();
      const isMatchName = nameLower.includes(query);
      const isMatchTag = selectedTag ? tool.Tag === selectedTag : true;

      return isMatchName && isMatchTag;
    });
  }, [data, searchQuery, selectedTag]);

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
    },
    {
      type: 'input',
      name: 'Tag',
      label: 'Tag',
      required: true,
    },
  ];

  return (
    <>
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* Input Tìm kiếm Tool */}
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

          {/* Dropdown Chọn Tag */}
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

        {/* Tổng số tool */}
        <Box
          sx={{
            backgroundColor: 'var(--main)',
            color: 'white',
            borderRadius: 1,
            padding: '10px 12px',
            display: 'inline-block',
            textAlign: 'center',
            height: '100%'
          }}
        >
          Tổng số tool: {response ? response.length : 0}
        </Box>

        {/* Nút thêm Tool */}
        <Box sx={{ ml: 2 }}>
          <Popup_Form
            button={
              <div
                className="flexCenter"
                style={{
                  height: 39,
                  background: 'var(--main)',
                  borderRadius: 3,
                  cursor: 'pointer',
                  color: 'white',
                  padding: '0 16px',
                  gap: 8
                }}
              >
                <AddBoxRoundedIcon sx={{ color: 'white', fontSize: 18 }} /> Thêm Tool
              </div>
            }
            title="Tạo dự án"
            fields={fields}
            onSave={handleSave}
          />
        </Box>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 2
        }}
      >
        {filteredData.map((tool, index) => {
          return (
            <Card key={index} sx={{ maxWidth: 280, cursor: 'pointer' }}>
              {/* Nút update / delete */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Tool_update datax={tool._id} data={tool} />
                <DeleteButton datax={tool._id} />
              </Box>

              {/* Phần hình ảnh - link */}
              <Link href={tool.Tool} target="_blank" rel="noopener noreferrer">
                <div
                  style={{
                    width: '100%',
                    height: 'aoto',
                    aspectRatio: '16/9',
                    position: 'relative',
                    zIndex: 0
                  }}
                >
                  <Image
                    fill
                    style={{ objectFit: 'cover' }}
                    src={tool.Image}
                    alt={tool.Name}
                  />
                </div>
              </Link>

              {/* Thông tin tool */}
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ fontSize: 16 }}
                >
                  {tool.Name.length > 25
                    ? `${tool.Name.substring(0, 25)}...`
                    : tool.Name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tool.Description.length > 100
                    ? `${tool.Description.substring(0, 100)}...`
                    : tool.Description}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Loading */}
      <Backdrop sx={{ color: '#fff', zIndex: 99 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Snackbar cảnh báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          Không hợp lệ: Đường dẫn phải bắt đầu bằng "https://".
        </MuiAlert>
      </Snackbar>
    </>
  );
}

'use client'

import React, { useState } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';

export function Prompt({ dbprompt }) {

  dbprompt = dbprompt.map((item) => ({
    label: item.name,
    value: item._id
  }))
  console.log(dbprompt);
  const fields = [
    {
      type: 'input',
      name: 'name',
      label: 'Tên prompt',
    },
    {
      type: 'input',
      name: 'prompt',
      label: 'prompt',

    },
    {
      type: 'select',
      name: 'tag',
      label: 'tag',
      options: dbprompt,
      required: true
    },
  ];

  const [value, setValue] = React.useState('1');
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [promptName, setPromptName] = useState('');
  const [promptDescription, setPromptDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSave = async (formData) => {
    try {
      // Call API to create prompt
      const response = await fetch('/api/prompt_create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          tag: formData.tag,
          prompt: formData.prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create prompt');
      }

      const newPrompt = await response.json();
      setPrompts([newPrompt, ...prompts]);
      window.location.reload();
    } catch (error) {
      console.error('Error creating prompt:', error);
      // Add error handling here (e.g., show error message to user)
    }
  };

  const PromptItem = ({ prompt }) => {
    const tagLabel = dbprompt.find(option => option.value === prompt.tag)?.label || prompt.tag;

    return (
      <Box
        onClick={() => setSelectedPrompt(prompt)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #eee',
          cursor: 'pointer'
        }}
      >
        <Avatar sx={{ mr: 2 }}>{prompt.name}</Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{prompt.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Tag: {tagLabel}
          </Typography>
        </Box>
        <Box sx={{
          position: 'relative', zIndex: 1, display: 'flex', gap: 1, marginLeft: 'auto', alignItems: 'center'
        }}>
        </Box>
      </Box>
    );
  };

  const SearchBar = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <input
        type="text"
        placeholder="Tìm kiếm prompt..."
        style={{
          width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'
        }}
      />
      <Box sx={{ ml: 2 }}>
        <select style={{ padding: '8px', borderRadius: '4px' }}>
          <option>Tất cả Tag</option>
        </select>
      </Box>
      <Box sx={{ ml: 2 }}>
        <Popup_Form
          button={
            <Button
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, color: 'white', backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <AddIcon />
            </Button>
          }
          title="Cập nhập dự án"
          fields={fields}
          onSave={handleSave}
        />
      </Box>
    </Box>
  );

  const handleNameChange = (e) => {
    setPromptName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setPromptDescription(e.target.value);
  };

  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleUpdate = async () => {
    if (!selectedPrompt) return;

    try {
      const response = await fetch('/api/prompt_update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPrompt._id,
          name: promptName,
          prompt: promptDescription,
          tag: selectedTag
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }

      const result = await response.json();
      if (result.air === 2) {
        const updatedPrompts = prompts.map(prompt =>
          prompt._id === selectedPrompt._id ? result.data : prompt
        );
        setPrompts(updatedPrompts);
        setSelectedPrompt(null);
      } else {
        throw new Error(result.mes || 'Failed to update prompt');
      }
    } catch (error) {
      console.error('Failed to update prompt:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPrompt) return;

    try {
      const response = await fetch('/api/prompt_delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPrompt._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }

      const result = await response.json();
      if (result.air === 2) {
        const updatedPrompts = prompts.filter(prompt => prompt._id !== selectedPrompt._id);
        setPrompts(updatedPrompts);
        setSelectedPrompt(null);
      } else {
        throw new Error(result.mes || 'Failed to delete prompt');
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  React.useEffect(() => {
    if (selectedPrompt) {
      setPromptName(selectedPrompt.name);
      setPromptDescription(selectedPrompt.prompt);
      setSelectedTag(selectedPrompt.tag);
    } else {
      setPromptName('');
      setPromptDescription('');
      setSelectedTag('');
    }
  }, [selectedPrompt]);  // Updated useEffect to fetch existing prompts

  React.useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('/api/prompt_get', {
          method: 'POST', // Changed to POST since the API uses POST method
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const result = await response.json();
        if (result.air === 2) {
          const sortedPrompts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPrompts(sortedPrompts);
        } else {
          throw new Error(result.mes || 'Failed to fetch prompts');
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
        // Add error handling here
      }
    };

    fetchPrompts();
  }, []);

  return (
    <Card sx={{ height: '100%', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, p: 2 }}>
        <Card sx={{ flex: 2 }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <h2>QUẢN LÝ PROMPT</h2>
                </Box>

                <SearchBar />

                {/* Danh sách prompt */}
                <Box sx={{ mt: 2 }}>
                  {prompts.map((prompt, index) => (
                    <PromptItem key={index} prompt={prompt} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Card sx={{ flex: 1, height: '750px' }}>
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <h2>THÔNG TIN CHI TIẾT</h2>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input
                type="text"
                placeholder="Tên prompt"
                value={promptName}
                onChange={handleNameChange}
                style={{
                  width: '95%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  backgroundColor: '#f0f0f0'
                }}
              />
              <select
                value={selectedTag}
                onChange={handleTagChange}
                style={{
                  width: '95%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  fontSize: '16px',
                  backgroundColor: '#f0f0f0'
                }}
              >
                <option value="">Chọn tag</option>
                {fields.find(f => f.name === 'tag').options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="prompt"
                value={promptDescription}
                onChange={handleDescriptionChange}
                style={{
                  width: '95%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  minHeight: '360px',
                  resize: 'vertical',
                  fontSize: '16px',
                  backgroundColor: '#f0f0f0'
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  disabled={!selectedPrompt}
                  sx={{
                    backgroundColor: '#primary.main', color: 'white', padding: '12px', '&:hover': { backgroundColor: 'primary.dark' }, width: '20%'
                  }}
                >
                  Cập nhập
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDelete}
                  disabled={!selectedPrompt}
                  sx={{
                    backgroundColor: 'red', color: 'white', padding: '12px', '&:hover': { backgroundColor: 'darkred' }, width: '20%'
                  }}
                >
                  Xóa
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Card>
  );
}

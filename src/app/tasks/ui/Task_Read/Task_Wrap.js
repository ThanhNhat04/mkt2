'use client';

import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Task_Create from "@/app/tasks/ui/Task_Create";
import Task_Read_List from "@/app/tasks/ui/Task_Read/Task_List";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import { Stack } from "@mui/material";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Status_ = ["Đã hoàn thành", "Chưa hoàn thành", "Đã kiểm duyệt", "Chưa kiểm duyệt"];

export default function Wrap_table({ dataTasks, dataProject, dataTaskType, token, user, users }) {

  const TaskTypeOptions = dataTaskType.map((type) => ({ name: type.name, id: type._id }));
  const taskCountMap = {};

  dataTasks ? dataTasks.forEach(t => {
    if (!taskCountMap[t.project]) taskCountMap[t.project] = 0;
    taskCountMap[t.project]++;
  }) : null

  const result = dataProject.map(proj => {
    return {
      name: proj.name,
      id: proj._id,
      leader: proj.leader,
      tasks: taskCountMap[proj._id] || 0
    };
  });

  const [selectedAreas, setSelectedAreas] = useState([]);
  const [Status, setStatus] = useState(null);
  const [Type, setType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    return dataTasks.filter((task) => {
      // Lọc theo dự án (nếu chọn)
      if (selectedAreas && selectedAreas.length > 0) {
        const selectedIds = selectedAreas.map(area => area.id);
        if (!selectedIds.includes(task.project)) return false;
      }
      if (Status) {
        if (Status === "Chưa kiểm duyệt") {
          if (task.checkerDone) return false;
        } else if (Status === "Đã kiểm duyệt") {
          if (!task.checkerDone) return false;
        } else if (Status === "Chưa hoàn thành") {
          if (task.checkerDone || task.doerDone) return false;
        } else if (Status === "Đã hoàn thành") {
          if (!task.doerDone) return false;
        }
      }

      if (Type && task.taskCategory !== Type) return false;


      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const taskNameMatch = task.name && task.name.toLowerCase().includes(query);
        const projectName = dataProject.find(p => p._id === task.project)?.name?.toLowerCase() || '';
        const projectNameMatch = projectName.includes(query);
        if (!taskNameMatch && !projectNameMatch) return false;
      }

      const taskStart = task.startDate ? new Date(task.startDate) : null;
      const taskEnd = task.endDate ? new Date(task.endDate) : null;

      if (startDate) {
        const filterStart = new Date(startDate);
        if (!taskStart || taskStart < filterStart) return false;
      }

      if (endDate) {
        const filterEnd = new Date(endDate);
        if (!taskEnd || taskEnd > filterEnd) return false;
      }

      return true;
    });
  }, [dataTasks, selectedAreas, Status, Type, searchQuery, startDate, endDate, dataProject]);
  const handleClearFilters = () => {
    setSelectedAreas([]);
    setStatus(null);
    setType(null);
    setSearchQuery('');
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 'var(--box)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Thanh trên cùng */}
      <Box sx={{ borderBottom: 'thin solid var(--background_1)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ borderBottom: 'thin solid var(--background_1)', p: 2 }}>
          {/* Khu vực tìm kiếm và chọn ngày */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '2px 8px',
                backgroundColor: 'white',
                maxWidth: '300px',
                flex: 1
              }}
            >
              <SearchIcon sx={{ color: '#888', marginRight: '8px' }} />
              <InputBase
                placeholder="Tìm kiếm dự án hoặc công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '450px',
                  p: '2px 0',
                  fontSize: '14px',
                  color: '#333',
                  '&::placeholder': {
                    color: '#aaa',
                  },
                }}
              />
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']} sx={{ p: 0, alignItems: 'center' }}>
                <DatePicker
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(newValue) => setStartDate(newValue ? newValue.toDate() : null)}
                  size="small"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { fontSize: '14px', marginLeft: '6px !important' },
                    },
                  }}
                />
                <div style={{ height: '100%', marginLeft: '8px' }} className="flexCenter text_2">-</div>
                <DatePicker
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(newValue) => setEndDate(newValue ? newValue.toDate() : null)}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { fontSize: '14px', ml: '8px !important' },
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Task_Create users={users} projects={dataProject} dataType={TaskTypeOptions} dataProject={result} token={token} user={user.id} />
            {(selectedAreas.length > 0 || Status || Type || searchQuery || startDate || endDate) && (
              <div onClick={handleClearFilters} className='flexCenter' style={{ height: 39, background: 'var(--main)', p: 0, borderRadius: 3, cursor: 'pointer', color: 'white', padding: '0 16px', gap: 8 }} >
                <FindReplaceIcon />Làm mới
              </div>
            )}
          </Stack>
        </Stack>

        {/* Khu vực các combobox lọc */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, gap: 2 }}>
          <Autocomplete
            multiple
            disablePortal
            options={result}
            sx={{ flex: 1 }}
            size="small"
            value={selectedAreas}
            onChange={(event, value) => setSelectedAreas(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${option.name} (${option.tasks} công việc)`}
            renderInput={(params) => <TextField {...params} label="Chọn dự án" />}
          />

          <Autocomplete
            disablePortal
            options={Status_}
            sx={{ flex: 1 }}
            size="small"
            value={Status}
            onChange={(event, value) => setStatus(value)}
            renderInput={(params) => <TextField {...params} label="Chọn trạng thái" />}
          />

          <Autocomplete
            disablePortal
            options={TaskTypeOptions}
            sx={{ flex: 1 }}
            size="small"
            getOptionLabel={(option) => option.name}
            value={TaskTypeOptions.find((item) => item.id === Type) || null} // Hiển thị giá trị hiện tại
            onChange={(event, value) => setType(value ? value.id : null)} // Lấy giá trị _id khi thay đổi
            renderInput={(params) => <TextField {...params} label="Chọn loại" />}
          />
        </Box>
      </Box>

      {/* Header bảng */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          backgroundColor: 'var(--main)',
          height: '40px',
          alignItems: 'center'
        }}
      >
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '1' }}>DỰ ÁN</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '2' }}>TÊN CÔNG VIỆC</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '1' }}>BẮT ĐẦU</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '1' }}>KẾT THÚC</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '.9' }}>LOẠI</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '1' }}>NGƯỜI KIỂM DUYỆT</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '.7', textAlign: 'center' }}>TRẠNG THÁI</Box>
        <Box sx={{ color: 'white', fontSize: '14px', fontWeight: '500', flex: '.3', textAlign: 'center' }}>THÊM</Box>
      </Box>

      {/* Danh sách task */}
      <Task_Read_List users={users} student={filteredData} project={dataProject} type={dataTaskType} dataType={TaskTypeOptions} dataProject={result} token={token} user={user.id} />
    </Box>
  );
}

'use client'

import * as React from 'react';
import { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
export default function Calendar_Feedback({ id, cmt, onSave }) {
  const [open, setOpen] = useState(false);
  const [dataCmt, setdataCmt] = useState(Array.isArray(cmt) ? cmt.flat() : []);

  const sendDataToParent = () => {
    onSave(id, dataCmt);
    setOpen(false);
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleInputChange(value) {
    setdataCmt(prevState => {
      // Tạo một mảng mới chỉ với các phần tử chưa có trong prevState
      const uniqueValues = value.filter(item => !prevState.includes(item));
      return [...prevState, ...uniqueValues];
    });
  }

  return (
    <>
      <Box onClick={handleClickOpen} className="Hover"><EditNoteRoundedIcon /></Box>
      <Dialog
        fullWidth='sm'
        maxWidth='sm'
        open={open}
        onClose={handleClose}>
        <Box sx={{ py: 1, px: 3 }}>
          <p className="Title_Popup" style={{ padding: "8px 0" }}>Nhận xét học sinh</p>
        </Box>
        <Box sx={{ width: '90%', margin: '0 auto' }}>
          <Autocomplete
            multiple
            id="tags-standard"
            options={TDHT}
            getOptionLabel={(option) => option}
            defaultValue={cmt ? cmt.filter(value => TDHT.includes(value)) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Thái độ học tập"
                placeholder="Thái độ học tập"
              />
            )}
            onChange={(event, value) => handleInputChange(value)}
          />
          <Autocomplete
            multiple
            id="tags-standard"
            options={KQHT}
            getOptionLabel={(option) => option}
            defaultValue={cmt ? cmt.filter(value => KQHT.includes(value)) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Kết quả học tập"
                placeholder="Kết quả học tập"
              />
            )}
            onChange={(event, value) => handleInputChange(value)}
          />
          <Autocomplete
            multiple
            id="tags-standard"
            options={DCCT}
            getOptionLabel={(option) => option}
            defaultValue={cmt ? cmt.filter(value => DCCT.includes(value)) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Điều cần cải thiện"
                placeholder="Điều cần cải thiện" />
            )}
            onChange={(event, value) => handleInputChange(value)}
          />
        </Box>
        <Box sx={{ py: 1, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={sendDataToParent}>Xác nhận</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}


let TDHT = [
  'Nhiệt tình và chăm chỉ',
  'Tích cực và chủ động',
  'Kiên trì và cầu tiến',
  'Sáng tạo và linh hoạt',
  'Tích cực hợp tác và tương tác',
  'Thiếu tập trung trong giờ học',
  'Hạn chế trong việc lắng nghe và tiếp thu ý kiến']
let KQHT = [
  'Nắm bắt tốt các kiến thức cơ bản',
  'Kết quả học tập ổn định',
  'Thể hiện tư duy tốt nhưng cần thêm thời gian để hoàn thiện',
  'Tiềm năng lớn nhưng chưa tối đa hóa',
  'Cần cải thiện kỹ năng trình bày và làm việc nhóm',
  'Còn hạn chế ở một số kiến thức nâng cao']
let DCCT = [
  'Cần tăng cường sự tập trung',
  'Phát triển tư duy phân tích',
  'Cải thiện tính tự giác',
  'Chú ý hơn đến cách trình bày và tính cẩn thận',
  'Khắc phục tính dễ nản khi gặp bài khó',
  'Tăng cường tính tương tác trong giờ học',
  'Cố gắng tiếp tục phát huy những điểm mạnh của mình']
'use client';

import React from 'react';
import Popup_Form from '@/utils/Extensions_UI/Popup_Form';
import Box from '@mui/material/Box';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import Button from '@mui/material/Button';

export default function ParentComponent() {
  // Cấu hình form
  const fields = [
    // Hai trường input đầu tiên
    {
      type: 'input',
      name: 'permissionName',
      label: 'Tên quyền',
    },
    {
      type: 'input',
      name: 'permissionCode',
      label: 'Mã quyền',
    },
    // Nhóm radio: Quyền xem khóa học
    {
      type: 'radio',
      name: 'courseView',
      label: 'Quyền xem khóa học',
      horizontal: true,
      options: [
        { label: 'Tất cả', value: 'All' },
        { label: 'Chặn', value: 'Block' },
        { label: 'Tùy chỉnh', value: 'Custom' },
      ],
    },
    // Select hiển thị khi chọn "Tùy chỉnh" trong Quyền xem khóa học
    {
      type: 'select',
      name: 'courseViewCustom',
      label: 'Tùy chọn khóa học có thể xem',
      conditional: {
        dependsOn: 'courseView',
        value: 'Custom',
      },
      options: [
        { label: 'Theo khu vực', value: 'Region' },
        { label: 'Theo chủ nhiệm', value: 'Leader' },
      ],
    },
    // Nhóm radio: Quyền tạo khóa học
    {
      type: 'radio',
      name: 'courseCreate',
      label: 'Quyền tạo khóa học',
      horizontal: true,
      options: [
        { label: 'Tất cả', value: 'All' },
        { label: 'Chặn', value: 'Block' },
      ],
    },
    // Nhóm radio: Quyền xem học sinh
    {
      type: 'radio',
      name: 'studentView',
      label: 'Quyền xem học sinh',
      horizontal: true,
      options: [
        { label: 'Tất cả', value: 'All' },
        { label: 'Chặn', value: 'Block' },
        { label: 'Tùy chỉnh', value: 'Custom' },
      ],
    },
    // Select hiển thị khi chọn "Tùy chỉnh" trong Quyền xem học sinh
    {
      type: 'select',
      name: 'studentViewCustom',
      label: 'Tùy chọn học sinh có thể xem',
      conditional: {
        dependsOn: 'studentView',
        value: 'Custom',
      },
      options: [
        { label: 'Theo khu vực', value: 'Region' },
        { label: 'Theo khóa', value: 'Class' },
      ],
    },
    // Nhóm radio: Quyền tạo học sinh
    {
      type: 'radio',
      name: 'studentCreate',
      label: 'Quyền tạo học sinh',
      horizontal: true,
      options: [
        { label: 'Tất cả', value: 'All' },
        { label: 'Chặn', value: 'Block' },
      ],
    },
  ];

  // Hàm xử lý khi lưu form
  const handleSave = (data) => {
    console.log('Kết quả form:', data);
    // Bạn có thể thực hiện các hành động khác như gửi dữ liệu tới server ở đây
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Popup_Form
        button={
          <Button variant="contained" startIcon={<AddBoxRoundedIcon sx={{ color: 'white', fontSize: 30 }} />}>
            Thêm Quyền
          </Button>
        }
        title="Tạo quyền mới"
        fields={fields}
        onSave={handleSave}
      />
    </Box>
  );
}

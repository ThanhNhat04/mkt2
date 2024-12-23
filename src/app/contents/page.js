'use client';
import React, { useState } from 'react';
import {
    Box,
    Card,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton,
    Tooltip,
    Pagination,
    Menu,
} from '@mui/material';
import {
    Add,
    CheckCircle,
    HighlightOff,
    PendingActions,
    MoreVert,
    Info,
    Edit,
    Delete,
    OpenInNew,
    FileDownload,
} from '@mui/icons-material';
import dayjs from 'dayjs';

export default function ContentManagement() {
    const [contents, setContents] = useState([
        {
            id: 1,
            title: 'Hướng dẫn học AI Robotic',
            author: 'Minh The',
            status: 'Đã hoàn thành',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            link: 'https://example.com/ai-robotic',
            platform: 'Web',
        },
        {
            id: 2,
            title: 'Khóa học IoT cho trẻ em',
            author: 'Editor',
            status: 'Chưa hoàn thành',
            startDate: '2024-12-02',
            endDate: '2025-01-02',
            link: 'https://example.com/iot-kids',
            platform: 'Web',
        },
        {
            id: 3,
            title: 'Giới thiệu khóa học Lập trình',
            author: 'Admin',
            status: 'Chưa làm',
            startDate: '2024-12-03',
            endDate: '2025-01-03',
            link: 'https://example.com/programming-course',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filterAuthor, setFilterAuthor] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        status: 'Chưa làm',
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
        link: '',
    });
    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [filterPlatform, setFilterPlatform] = useState('');
    const itemsPerPage = 10;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
        if (!formData.author.trim()) newErrors.author = 'Tác giả không được để trống';
        if (!formData.link.trim()) newErrors.link = 'Link bài viết không được để trống';
        if (!formData.startDate) newErrors.startDate = 'Thời gian bắt đầu không được để trống';
if (!formData.endDate) newErrors.endDate = 'Thời gian kết thúc không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDialogOpen = (content = null) => {
        setEditingContent(content);
        setFormData(
            content || {
                title: '',
                author: '',
                status: 'Chưa làm',
                startDate: dayjs().format('YYYY-MM-DD'),
                endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                link: '',
            }
        );
        setErrors({});
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingContent(null);
        setFormData({
            title: '',
            author: '',
            status: 'Chưa làm',
            startDate: dayjs().format('YYYY-MM-DD'),
            endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
            link: '',
        });
        setErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveContent = () => {
        if (!validateForm()) return;

        if (editingContent) {
            setContents((prev) =>
                prev.map((content) =>
                    content.id === editingContent.id ? { ...editingContent, ...formData } : content
                )
            );
        } else {
            const newContent = {
                id: contents.length + 1,
                ...formData,
            };
            setContents((prev) => [...prev, newContent]);
        }
        handleDialogClose();
    };

    const handleDeleteContent = (id) => {
        setContents((prev) => prev.filter((content) => content.id !== id));
    };

    const handleExportCSV = () => {
        const csvContent = [
            ['Tiêu đề', 'Tác giả', 'Trạng thái', 'nền tảng', 'Bắt đầu', 'Kết thúc', 'Link'],
            ...contents.map((content) => [
                content.title,
                content.author,
                content.status,
                content.platform,
                content.startDate,
                content.endDate,
                content.link,
            ]),
        ]
            .map((e) => e.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'contents.csv';
        link.click();
    };

    const handleStatusChange = (id, newStatus) => {
        setContents((prev) =>
            prev.map((content) =>
                content.id === id ? { ...content, status: newStatus } : content
            )
        );
    };

    const handlePlatformChange = (id, newPlatform) => {
        setContents((prev) =>
prev.map((content) =>
                content.id === id ? { ...content, platform: newPlatform } : content
            )
        );
    };

    const statusIcons = {
        'Đã hoàn thành': (active) => <CheckCircle fontSize="small" sx={{ color: active ? 'green' : 'gray' }} />,
        'Chưa hoàn thành': (active) => <PendingActions fontSize="small" sx={{ color: active ? 'orange' : 'gray' }} />,
        'Chưa làm': (active) => <HighlightOff fontSize="small" sx={{ color: active ? 'red' : 'gray' }} />
    };

    const statusTooltips = {
        'Đã hoàn thành': 'Công việc đã hoàn thành',
        'Chưa hoàn thành': 'Công việc chưa hoàn thành',
        'Chưa làm': 'Công việc chưa bắt đầu',
    };

    const getCompletedCount = () => contents.filter((content) => content.status === 'Đã hoàn thành').length;
    const getPendingCount = () => contents.filter((content) => content.status === 'Chưa hoàn thành').length;
    const getNotStartedCount = () => contents.filter((content) => content.status === 'Chưa làm').length;

    const filteredContents = contents.filter(
        (content) =>
            (content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                content.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (!filterStatus || content.status === filterStatus) &&
            (!filterPlatform || content.platform === filterPlatform) &&
            (!filterAuthor || content.author === filterAuthor)
    );

    const paginatedContents = filteredContents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleMenuOpen = (event, task) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTask(task);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedTask(null);
    };

    const handleViewDetails = () => {
        alert(`Xem chi tiết công việc: ${selectedTask?.title}`);
        handleMenuClose();
    };

    const handleEditTask = () => {
        handleDialogOpen(selectedTask);
        handleMenuClose();
    };

    const handleCreateSubTask = () => {
        alert(`Tạo công việc con cho: ${selectedTask?.title}`);
        handleMenuClose();
    };

    const handleDeleteTask = () => {
        if (selectedTask) {
            handleDeleteContent(selectedTask.id);
        }
        handleMenuClose();
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom style={{ color: '#1976d2' }}>
                Quản lý nội dung
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap' }}>
                <Card sx={{ flex: 1, marginRight: 1, padding: 2, backgroundColor: 'blue', color: 'white' }}>
                    <Typography variant="h6">Tổng công việc</Typography>
<Typography variant="h4">{contents.length}</Typography>
                    <Typography>Tổng số công việc đã tạo</Typography>
                </Card>
                <Card sx={{ flex: 1, marginRight: 1, backgroundColor: 'green', color: 'white', padding: 2 }}>
                    <Typography variant="h6">Đã hoàn thành</Typography>
                    <Typography variant="h4">{getCompletedCount()}</Typography>
                    <Typography>Tổng số công việc hoàn thành</Typography>
                </Card>
                <Card sx={{ flex: 1, marginRight: 1, backgroundColor: 'orange', color: 'white', padding: 2 }}>
                    <Typography variant="h6">Chưa hoàn thành</Typography>
                    <Typography variant="h4">{getPendingCount()}</Typography>
                    <Typography>Tổng số công việc chưa hoàn thành</Typography>
                </Card>
                <Card sx={{ flex: 1, padding: 2, backgroundColor: 'gray', color: 'white' }}>
                    <Typography variant="h6">Chưa làm</Typography>
                    <Typography variant="h4">{getNotStartedCount()}</Typography>
                    <Typography>Tổng số công việc chưa làm</Typography>
                </Card>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Tìm kiếm"
                    variant="outlined"
                    size="small"
                    sx={{ width: '300px', mb: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TextField
                    select
                    label="Lọc theo trạng thái"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ width: '200px', mb: 1 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                    <MenuItem value="Chưa hoàn thành">Chưa hoàn thành</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Lọc theo nền tảng"
                    value={filterPlatform}
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    sx={{ width: '200px', mb: 1 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Web">Web</MenuItem>
                    <MenuItem value="Page">Page</MenuItem>
                    <MenuItem value="Zalo">Zalo</MenuItem>
                </TextField>
                {/* Thêm phần lọc theo tác giả */}
                <TextField
                    select
                    label="Lọc theo tác giả"
                    value={filterAuthor}
onChange={(e) => setFilterAuthor(e.target.value)}
                    sx={{ width: '200px', mb: 1 }}
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    {Array.from(new Set(contents.map((content) => content.author))).map((author, index) => (
                        <MenuItem key={index} value={author}>
                            {author}
                        </MenuItem>
                    ))}
                </TextField>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()}>
                    Tạo nội dung mới
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<FileDownload />}
                    onClick={handleExportCSV}
                    sx={{ ml: 1 }}
                >
                    Xuất CSV
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tiêu đề</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tác giả</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nền tảng</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Bắt đầu</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Kết thúc</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Link bài viết</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Thêm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedContents.map((content, index) => (
                            <TableRow key={index}>
                                <TableCell>{content.title}</TableCell>
                                <TableCell>{content.author}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {['Đã hoàn thành', 'Chưa hoàn thành', 'Chưa làm'].map((status) => (
                                            <Tooltip key={status} title={statusTooltips[status]} arrow>
                                                <IconButton
                                                    onClick={() => handleStatusChange(content.id, status)}
                                                    sx={{
                                                        color: content.status === status
? status === 'Đã hoàn thành'
                                                                ? 'green'
                                                                : status === 'Chưa hoàn thành'
                                                                    ? 'orange'
                                                                    : 'red'
                                                            : 'gray',
                                                    }}
                                                >
                                                    {statusIcons[status](content.status === status)}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </TableCell>
                                {/* Nền tảng */}
                                <TableCell>
                                    <TextField
                                        select
                                        value={content.platform}
                                        onChange={(e) => {
                                            const newPlatform = e.target.value;
                                            setContents((prev) =>
                                                prev.map((task) =>
                                                    task.id === content.id
                                                        ? { ...task, platform: newPlatform }
                                                        : task
                                                )
                                            );
                                        }}
                                        size="small"
                                        sx={{ width: '120px' }}
                                    >
                                        <MenuItem value="Web">Web</MenuItem>
                                        <MenuItem value="Page">Page</MenuItem>
                                        <MenuItem value="Zalo">Zalo</MenuItem>
                                    </TextField>
                                </TableCell>
                                <TableCell>{content.startDate}</TableCell>
                                <TableCell>{content.endDate}</TableCell>
                                <TableCell>
                                    <Button
                                        href={content.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        startIcon={<OpenInNew />}
                                    >
                                        Xem
                                    </Button>
                                </TableCell>
                                <TableCell>
<IconButton onClick={(e) => handleMenuOpen(e, content)}>
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        anchorEl={menuAnchor}
                                        open={Boolean(menuAnchor)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={handleViewDetails}>
                                            <Info fontSize="small" sx={{ mr: 1 }} /> Xem chi tiết
                                        </MenuItem>
                                        <MenuItem onClick={handleEditTask}>
                                            <Edit fontSize="small" sx={{ mr: 1 }} /> Sửa công việc
                                        </MenuItem>
                                        <MenuItem onClick={handleDeleteTask} sx={{ color: 'red' }}>
                                            <Delete fontSize="small" sx={{ mr: 1 }} /> Xóa công việc
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(filteredContents.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth>
                <DialogTitle>{editingContent ? 'Chỉnh sửa nội dung' : 'Tạo nội dung mới'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        error={!!errors.title}
                        helperText={errors.title}
                        label="Tiêu đề"
                        name="title"
                        value={formData.title}
                        variant='filled'
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        error={!!errors.author}
                        helperText={errors.author}
                        label="Tác giả"
                        name="author"
                        variant='filled'
                        value={formData.author}
                        onChange={handleFormChange}
                        fullWidth
                    />
                    <TextField
                        select
                        label="Trạng thái"
                        name="status"
value={formData.status}
                        onChange={handleFormChange}
                        fullWidth
                    >
                        <MenuItem value="Chưa làm">Chưa làm</MenuItem>
                        <MenuItem value="Chưa hoàn thành">Chưa hoàn thành</MenuItem>
                        <MenuItem value="Đã hoàn thành">Đã hoàn thành</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Nền tảng"
                        name="platform"
                        value={formData.platform}
                        onChange={handleFormChange}
                        fullWidth
                    >
                        <MenuItem value="Web">Web</MenuItem>
                        <MenuItem value="Page">Page</MenuItem>
                        <MenuItem value="Zalo">Zalo</MenuItem>
                    </TextField>
                    <TextField
                        label="Link bài viết"
                        name="link"
                        value={formData.link}
                        onChange={handleFormChange}
                        variant='filled'
                        error={!!errors.link}
                        helperText={errors.link}
                        fullWidth
                    />
                    <TextField
                        label="Bắt đầu"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                        fullWidth
                    />
                    <TextField
                        label="Kết thúc"
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setFormData({
                                title: '',
                                author: '',
                                status: 'Chưa làm',
                                startDate: dayjs().format('YYYY-MM-DD'),
                                endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                                link: '',
                            });
                            setErrors({});
                        }}
                        color="secondary"
                    >
                        Reset
                    </Button>
                    <Button onClick={handleDialogClose} color="secondary">
Hủy
                    </Button>
                    <Button onClick={handleSaveContent} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
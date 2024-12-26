"use client";

import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Task_Create from "@/app/tasks/ui/Task_Create";
import Task_Read_List from "@/app/tasks/ui/Task_Read/Task_List";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Mảng trạng thái
const Status_ = [
  "Đã hoàn thành",
  "Chưa hoàn thành",
  "Đã kiểm duyệt",
  "Chưa kiểm duyệt",
];

export default function Wrap_table({
  dataTasks,
  dataProject,
  dataTaskType,
  token,
  user,
  users,
  dataFound
}) {
  // 1) Tính số lượng task theo taskCategory
  // ---------------------------------------------------------------------------
  const jobCountMap = {};
  dataTasks.forEach((task) => {
    if (task.taskCategory) {
      if (!jobCountMap[task.taskCategory]) jobCountMap[task.taskCategory] = 0;
      jobCountMap[task.taskCategory]++;
    }
  });

  // Tạo mảng loại công việc, mỗi loại kèm số lượng công việc
  const TaskTypeOptions = dataTaskType.map((type) => {
    return {
      // Nên trả về ._id để so sánh với task.taskCategory
      ...type,
      count: jobCountMap[type._id] || 0,
    };
  });

  // 2) Tính số lượng task theo project
  // ---------------------------------------------------------------------------
  const taskCountMap = {};
  if (dataTasks) {
    dataTasks.forEach((t) => {
      if (!taskCountMap[t.project]) taskCountMap[t.project] = 0;
      taskCountMap[t.project]++;
    });
  }

  // Tạo mảng project + số lượng task
  const result = dataProject.map((proj) => ({
    name: proj.name,
    id: proj._id,
    leader: proj.leader,
    tasks: taskCountMap[proj._id] || 0,
  }));

  // 3) Các state phục vụ lọc
  // ---------------------------------------------------------------------------
  const [selectedAreas, setSelectedAreas] = useState([]); // Lọc dự án
  const [Status, setStatus] = useState(null); // Lọc trạng thái
  // Sửa lại: lưu Type bằng _id thay vì id
  const [Type, setType] = useState(null); // Lọc loại công việc
  const [searchQuery, setSearchQuery] = useState(""); // Ô tìm kiếm
  const [startDate, setStartDate] = useState(null); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(null); // Ngày kết thúc

  // 4) useMemo để lọc dữ liệu
  // ---------------------------------------------------------------------------
  const filteredData = useMemo(() => {
    return dataTasks.filter((task) => {
      // Lọc theo dự án
      if (selectedAreas && selectedAreas.length > 0) {
        const selectedIds = selectedAreas.map((area) => area.id);
        if (!selectedIds.includes(task.project)) return false;
      }

      // Lọc trạng thái
      if (Status) {
        if (Status === "Chưa kiểm duyệt") {
          if (task.checkerDone) return false;
        } else if (Status === "Đã kiểm duyệt") {
          if (!task.checkerDone) return false;
        } else if (Status === "Chưa hoàn thành") {
          // Chưa hoàn thành => doerDone false && checkerDone false
          if (task.checkerDone || task.doerDone) return false;
        } else if (Status === "Đã hoàn thành") {
          // Đã hoàn thành => doerDone true
          if (!task.doerDone) return false;
        }
      }

      // Lọc theo loại công việc (nếu đang chọn một loại)
      // So sánh task.taskCategory với Type (đang là _id)
      if (Type && task.taskCategory !== Type) return false;

      // Lọc theo từ khoá search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const taskNameMatch = task.name?.toLowerCase().includes(query);
        const projectName =
          dataProject.find((p) => p._id === task.project)?.name?.toLowerCase() ||
          "";
        const projectNameMatch = projectName.includes(query);
        if (!taskNameMatch && !projectNameMatch) return false;
      }

      // Lọc theo ngày
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
  }, [
    dataTasks,
    selectedAreas,
    Status,
    Type,
    searchQuery,
    startDate,
    endDate,
    dataProject,
  ]);

  // Nút làm mới
  const handleClearFilters = () => {
    setSelectedAreas([]);
    setStatus(null);
    setType(null);
    setSearchQuery("");
    setStartDate(null);
    setEndDate(null);
  };

  // 5) Giao diện
  // ---------------------------------------------------------------------------
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: "var(--box)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thanh trên cùng */}
      <Box sx={{ borderBottom: "thin solid var(--background_1)" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "space-between",
            borderBottom: "thin solid var(--background_1)",
            padding: 8,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={["DatePicker", "DatePicker"]}
              sx={{ p: 0, alignItems: "center" }}
            >
              <DatePicker
                value={startDate ? dayjs(startDate) : null}
                onChange={(newValue) =>
                  setStartDate(newValue ? newValue.toDate() : null)
                }
                size="small"
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      fontSize: "12px",
                      width: "90px",
                      marginLeft: "6px !important",
                    },
                  },
                }}
              />
              <div style={{ height: "100%", marginLeft: "8px" }} className="flexCenter text_2">
                -
              </div>
              <DatePicker
                value={endDate ? dayjs(endDate) : null}
                onChange={(newValue) =>
                  setEndDate(newValue ? newValue.toDate() : null)
                }
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      fontSize: "12px",
                      width: "90px",
                      marginLeft: "6px !important",
                    },
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <Autocomplete
            multiple
            disablePortal
            options={result}
            size="small"
            sx={{ width: "350px" }}
            value={selectedAreas}
            onChange={(event, value) => setSelectedAreas(value)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              `${option.name} (${option.tasks} công việc)`
            }
            renderTags={(tagValue, getTagProps) => {
              if (tagValue.length === 0) {
                return null;
              }

              const visibleTag = tagValue[0]; // Hiển thị tag đầu tiên
              const remainingCount = tagValue.length - 1; // Số lượng tag còn lại

              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap", // Ngăn xuống dòng
                    overflow: "hidden", // Ẩn phần thừa
                    textOverflow: "ellipsis", // Thêm dấu "..." nếu quá dài
                    whiteSpace: "nowrap",
                  }}
                >
                  <Chip
                    size="small"
                    label={`${visibleTag.name} (${visibleTag.tasks} công việc)`}
                    {...getTagProps({ index: 0 })}
                  />
                  {remainingCount > 0 && (
                    <Chip
                      size="small"
                      label={`+${remainingCount} lựa chọn`}
                      sx={{
                        backgroundColor: "#f0f0f0",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn dự án"
                sx={{
                  "& .MuiInputBase-root": {
                    height: "40px", // Cố định chiều cao input
                    overflow: "hidden", // Ẩn phần nội dung tràn
                  },
                }}
              />
            )}
          />

          {/* Lọc trạng thái */}
          <Autocomplete
            disablePortal
            options={Status_}
            sx={{ flex: 1 }}
            size="small"
            value={Status}
            onChange={(event, value) => setStatus(value)}
            renderInput={(params) => (
              <TextField {...params} label="Chọn trạng thái" />
            )}
          />

          {/* Ô tìm kiếm */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "thin solid var(--background_1)",
              borderRadius: 1,
              padding: "2px 8px",
              backgroundColor: "white",
              maxWidth: "300px",
              flex: 1,
            }}
          >
            <SearchIcon sx={{ color: "#888", marginRight: "8px" }} />
            <InputBase
              placeholder="Tìm kiếm dự án hoặc công việc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "450px",
                p: "2px 0",
                fontSize: "14px",
                color: "#333",
                "&::placeholder": {
                  color: "#aaa",
                },
              }}
            />
          </Box>

          {/* Tạo công việc mới */}
          <Task_Create
            users={users}
            projects={dataProject}
            dataType={TaskTypeOptions} // truyền mảng loại kèm count
            dataProject={result}
            token={token}
            user={user.id}
            dataFound={dataFound}
          />
        </div>

        {/* Khu vực các nút JobTypeCard để lọc theo loại công việc */}
        <Box sx={{ display: "flex", justifyContent: "start", p: 0.5, gap: 0.5 }}>
          <JobTypeCard
            name="Tất cả"
            count={dataTasks.length} // Tổng số công việc
            onClick={() => {
              setType(null); // Xóa bộ lọc loại công việc
            }}
            isActive={Type === null} // Active khi Type === null
          />
          {TaskTypeOptions.map((job) => (
            <JobTypeCard
              key={job._id}
              name={job.name}
              count={job.count}
              // Khi click, ta setType = job._id
              onClick={() => {
                setType((prev) => (prev === job._id ? null : job._id));
              }}
              isActive={Type === job._id}
            />
          ))}
        </Box>
      </Box>

      {/* Header bảng */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 1,
          py: 0.5,
          backgroundColor: "var(--main)",
          height: "40px",
          alignItems: "center",
        }}
      >
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".7" }}>
          DỰ ÁN
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: "1.6" }}>
          TÊN CÔNG VIỆC
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: "1" }}>
          THỜI GIAN
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".6" }}>
          LOẠI
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".6" }}>
          THỰC HIỆN
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".6" }}>
          TIẾN ĐỘ
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".6" }}>
          DUYỆT
        </Box>
        <Box sx={{ color: "white", fontSize: "12px", fontWeight: "500", flex: ".6", textAlign: "center", }}>
          NỀN TẢNG
        </Box>
        <Box
          sx={{
            color: "white",
            fontSize: "12px",
            fontWeight: "500",
            flex: ".7",
            textAlign: "center",
          }}
        >
          TRẠNG THÁI
        </Box>
        <Box
          sx={{
            color: "white",
            fontSize: "12px",
            fontWeight: "500",
            flex: ".3",
            textAlign: "center",
          }}
        >
          THÊM
        </Box>
      </Box>

      {/* Danh sách task */}
      <Task_Read_List
        users={users}
        student={filteredData} // data đã lọc
        project={dataProject}
        type={dataTaskType} // hoặc TaskTypeOptions tuỳ bạn
        dataType={TaskTypeOptions}
        dataProject={result}
        token={token}
        user={user.id}
      />
    </Box>
  );
}

/**
 * Component hiển thị 1 "thẻ" job type
 * - `onClick`: hàm click vào card
 * - `isActive`: nếu card được chọn thì highlight
 */
const JobTypeCard = ({ name, count, onClick, isActive }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: "thin solid var(--background_1)",
        borderRadius: "8px",
        padding: "8px 16px",
        display: "inline-block",
        textAlign: "center",
        fontWeight: "bold",
        margin: "3px",
        cursor: "pointer",
        // Nếu đang active thì tô màu khác
        backgroundColor: isActive ? "var(--main)" : "transparent",
        "&:hover": {
          backgroundColor: isActive ? "var(--main)" : "#e2e9ff",
        },
      }}
    >
      <p className="text_4_m" style={{ color: isActive ? "white " : "var(--main)", }}>
        {name}: {count}
      </p>
    </Box>
  );
};

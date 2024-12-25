"use client";

function getMonthMatrix(year, month) {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  let currentDay = 1 - firstDayOfWeek;
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (currentDay < 1 || currentDay > lastDate) {
        week.push(null);
      } else {
        week.push(currentDay);
      }
      currentDay++;
    }
    weeks.push(week);
  }
  return weeks;
}

export default function Calendar_Main({ year, month, events, filters, onPrevMonth, onNextMonth, project, task }) {
  const weeks = getMonthMatrix(year, month);

  // Lọc công việc theo filters và tháng
  const filteredTasks = task.filter((t) => {
    const taskProject = project.find((p) => p._id === t.project);
    if (!taskProject) return false;

    // Kiểm tra filter của project
    if (!filters[taskProject.name]) return false;

    const taskStart = new Date(t.startDate);
    const taskEnd = new Date(t.endDate);

    // Kiểm tra công việc thuộc tháng hiện tại
    return (
      (taskStart.getFullYear() === year && taskStart.getMonth() + 1 === month) ||
      (taskEnd.getFullYear() === year && taskEnd.getMonth() + 1 === month)
    );
  });

  // Gom nhóm công việc theo ngày
  const eventMap = {};
  filteredTasks.forEach((t) => {
    const taskStart = new Date(t.startDate);
    const taskEnd = new Date(t.endDate);

    // Lặp qua từng ngày trong khoảng startDate -> endDate
    for (
      let date = new Date(taskStart);
      date <= taskEnd;
      date.setDate(date.getDate() + 1)
    ) {
      if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        const day = date.getDate();
        if (!eventMap[day]) eventMap[day] = [];
        eventMap[day].push({
          title: t.name,
          color: "#ffcccb", // Bạn có thể tùy chỉnh màu sắc
          project: project.find((p) => p._id === t.project)?.name || "Unknown",
        });
      }
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Thanh điều hướng tháng */}
      <div
        style={{
          height: "max-content",
          display: "flex",
          alignItems: "center",
          paddingBottom: "20px",
          justifyContent: "center",
          gap: 18,
          borderBottom: "thin solid var(--background_1)",
        }}
      >
        <button onClick={onPrevMonth} style={navButtonStyle}>
          {"<"}
        </button>
        <h2 className="text_2" style={{ margin: "0 10px" }}>
          Tháng {month} năm {year}
        </h2>
        <button onClick={onNextMonth} style={navButtonStyle}>
          {">"}
        </button>
      </div>

      {/* Hiển thị lịch */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderTop: "1px solid #ddd",
          borderLeft: "1px solid #ddd",
          borderRadius: 3,
          flex: 1,
        }}
      >
        {/* Header các ngày trong tuần */}
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 2</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 3</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 4</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 5</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 6</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Thứ 7</p>
        </div>
        <div style={headerCellStyle}>
          <p className="text_4">Chủ nhật</p>
        </div>

        {/* Hiển thị các ngày trong lịch */}
        {weeks.map((week, widx) =>
          week.map((day, didx) => (
            <div key={`${widx}-${didx}`} style={dayCellStyle}>
              {day && (
                <div style={{ padding: "5px", position: "relative" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {day}
                  </span>
                  {/* Hiển thị công việc trong ngày */}
                  {eventMap[day] &&
                    eventMap[day].slice(0, 1).map((ev, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: ev.color,
                          color: "#000",
                          padding: "2px 5px",
                          borderRadius: "4px",
                          marginTop: "2px",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ev.title}
                      </div>
                    ))}
                  {/* Hiển thị số lượng công việc còn lại */}
                  {eventMap[day] && eventMap[day].length > 1 && (
                    <div
                      style={{
                        fontSize: "12px",
                        marginTop: "2px",
                        color: "#666",
                      }}
                    >
                      +{eventMap[day].length - 1} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const headerCellStyle = {
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
  padding: "5px",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "14px",
  background: "#f9f9f9",
};

const dayCellStyle = {
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
  minHeight: "80px",
  overflow: "hidden",
};

const navButtonStyle = {
  border: "1px solid #ccc",
  background: "#fff",
  marginRight: "5px",
  cursor: "pointer",
  padding: "5px 10px",
  borderRadius: "4px",
};

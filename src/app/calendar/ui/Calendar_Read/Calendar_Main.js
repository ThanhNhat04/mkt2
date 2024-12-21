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

export default function Calendar_Main({ year, month, events, filters, onPrevMonth, onNextMonth, project }) {
  const weeks = getMonthMatrix(year, month);
  const filteredEvents = filters.viewAll ? events : events.filter(ev => filters[ev.project]);

  const eventMap = {};
  filteredEvents.forEach(ev => {
    const evDate = new Date(ev.date);
    if (evDate.getFullYear() === year && (evDate.getMonth() + 1) === month) {
      const day = evDate.getDate();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push(ev);
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 'max-content', display: 'flex', alignItems: 'center', paddingBottom: '20px', justifyContent: 'center', gap: 18, borderBottom: 'thin solid var(--background_1)' }}>
        <button onClick={onPrevMonth} style={navButtonStyle}>{'<'}</button>
        <h2 className="text_2" style={{ margin: '0 10px' }}>Tháng {month} năm {year}</h2>
        <button onClick={onNextMonth} style={navButtonStyle}>{'>'}</button>
      </div>

      <div style={{
        marginTop: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderTop: '1px solid #ddd',
        borderLeft: '1px solid #ddd',
        borderRadius: 3,
        flex: 1
      }}>
        <div style={headerCellStyle}><p className="text_4">Thứ 2</p></div>
        <div style={headerCellStyle}><p className="text_4">Thứ 3</p></div>
        <div style={headerCellStyle}><p className="text_4">Thứ 4</p></div>
        <div style={headerCellStyle}><p className="text_4">Thứ 5</p></div>
        <div style={headerCellStyle}><p className="text_4">Thứ 6</p></div>
        <div style={headerCellStyle}><p className="text_4">Thứ 7</p></div>
        <div style={headerCellStyle}><p className="text_4">Chủ nhật</p></div>

        {weeks.map((week, widx) =>
          week.map((day, didx) => (
            <div key={`${widx}-${didx}`} style={dayCellStyle} className="tesst">
              {day && (
                <div style={{ padding: '5px', position: 'relative' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{day}</span>
                  {eventMap[day] && eventMap[day].slice(0, 1).map((ev, idx) => (
                    <div key={idx} style={{
                      backgroundColor: ev.color || '#eee',
                      color: '#000',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      marginTop: '2px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {ev.title}
                    </div>
                  ))}
                  {eventMap[day] && eventMap[day].length > 1 && (
                    <div style={{ fontSize: '12px', marginTop: '2px', color: '#666' }}>
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
  borderRight: '1px solid #ddd',
  borderBottom: '1px solid #ddd',
  padding: '5px',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
  background: '#f9f9f9'
};

const dayCellStyle = {
  borderRight: '1px solid #ddd',
  borderBottom: '1px solid #ddd',
  minHeight: '80px',
  overflow: 'hidden'
};

const navButtonStyle = {
  border: '1px solid #ccc',
  background: '#fff',
  marginRight: '5px',
  cursor: 'pointer',
  padding: '5px 10px',
  borderRadius: '4px'
};

const viewButtonStyle = {
  background: '#fff',
  border: '1px solid #ccc',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '4px'
};

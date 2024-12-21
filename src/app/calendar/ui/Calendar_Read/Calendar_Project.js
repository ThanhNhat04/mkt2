"use client";

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push('');
  }
  for (let d = 1; d <= lastDate; d++) {
    days.push(d);
  }
  return days;
}

export default function Calendar_Project({ year, month, filters, onFilterChange, events }) {
  const days = generateCalendarDays(year, month);
  const project = Array.from(
    new Map(events.map((item) => [item.project, item])).values()
  );

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '20px' }}>
      <button style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#6C63FF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        marginBottom: '12px',
        cursor: 'pointer'
      }}>+ Thêm dự án</button>
      <p className="text_3" style={{ padding: '8px 0 16px 0', borderTop: 'thin solid var(--background_1)' }}>Tháng {month} {year}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '12px', color: '#555', margin: '16px 0' }}>
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        {days.map((day, idx) => (
          <div key={idx} style={{ padding: '5px', borderRadius: '4px', backgroundColor: day === 12 ? '#ececff' : 'transparent', color: day === 12 ? '#6C63FF' : '#000' }}>
            {day ? day : ''}
          </div>
        ))}
      </div>

      <p className="text_3" style={{ padding: '8px 0 16px 0', borderTop: 'thin solid var(--background_1)' }}>Danh sách dự án</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
        <label style={{ display: 'flex', gap: 8 }} className="custom-checkbox">
          <input type="checkbox" checked={filters.viewAll} onChange={(e) => onFilterChange('viewAll', e.target.checked)} />
          <span className="checkmark" style={{ borderColor: '#4caf50', backgroundColor: '#4caf50' }}></span>
          <p className="text_4_m">Tất cả</p>
        </label>
        {project.map((t, index) => (
          <label key={index} style={{ display: 'flex', gap: 8 }} className="custom-checkbox">
            <input type="checkbox" checked={filters[`${t.project}`]} onChange={(e) => onFilterChange(`${t.project}`, e.target.checked)} />
            <span className="checkmark" style={{ borderColor: `${t.color}`, backgroundColor: `${t.color}` }}></span>
            <p className="text_4_m">{t.project}</p>
          </label>
        ))
        }
      </div>
    </div>
  );
}

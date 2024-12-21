import Calendar_Wrap from './ui/Calendar_Read/Calendar_Wrap';

export default async function Page() {
  const events = [
    { date: '2024-12-12', title: 'Lau nhà', color: '#a2a2ff', project: 'Việc Nhà' },
    { date: '2024-12-18', title: 'Làm bài tập', color: '#ffe7a2', project: 'Học Tập' },
    { date: '2024-12-18', title: 'Chơi game', color: '#ffe7a2', project: 'Học Tập' },
    { date: '2024-12-22', title: 'Soạn bài mới', color: '#ffe7a2', project: 'Học Tập' },
    { date: '2024-12-20', title: "Rửa bát", color: '#a2a2ff', project: 'Việc Nhà' },
    { date: '2024-12-20', title: 'Soạn văn', color: '#ffe7a2', project: 'Học Tập' },
  ];

  const project = Array.from(new Set(events.map((item) => item.project)));

  return (
    <div style={{ display: 'flex', height: '100%', borderRadius: 8, boxShadow: 'var(--box)', background: 'white' }}>
      <Calendar_Wrap initialYear={2024} initialMonth={12} events={events} project={project} />
    </div>
  );
}

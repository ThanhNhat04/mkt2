import { Project_Read_all, Task_Read_all } from '@/app/data'
import Calendar_Wrap from './ui/Calendar_Read/Calendar_Wrap';

export default async function Page() {
  let datatasks = await Task_Read_all()
  let dataproject = await Project_Read_all()
  let projectname = Array.from(new Set(dataproject.map((item) => item.name)));

  return (
    <div style={{ display: 'flex', height: '100%', borderRadius: 8, boxShadow: 'var(--box)', background: 'white' }}>
      <Calendar_Wrap initialYear={2024} initialMonth={12} events={dataproject} project={projectname} task={datatasks} />
    </div>
  );
}

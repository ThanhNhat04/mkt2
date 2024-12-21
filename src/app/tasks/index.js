import Grid from '@mui/material/Unstable_Grid2';
import Wrap_table from './ui/Task_Read/Task_Wrap';
import Box from '@mui/material/Box';
import { Project_Read_all, Task_Read_all, Task_Read_Type, User_Read_all } from '@/app/data'
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function Task() {
  const cookieStore = cookies();
  const token = cookieStore.get('airobotic');
  const user = jwt.verify(token.value, process.env.JWT_SECRET)
  let dataTask = await Task_Read_all()
  const dataUser = await User_Read_all()
  const dataProject = await Project_Read_all()
  const dataTaskType = await Task_Read_Type()
  
  let g = [[], [], []]
  dataTask ? dataTask.forEach(e => {
    if (e.checkerDone) {
      g[0] = g[0].concat(e)
    } else if (e.doerDone) {
      g[1] = g[1].concat(e)
    } else {
      g[2] = g[2].concat(e)
    }
  }) : dataTask = []
  console.log(dataUser, 1);

  return (
    <>
      <Grid container spacing={2} sx={{ m: 0 }}>
        <Grid xs={3} sx={{ position: 'relative' }}>
          <div >
            <Box_2_Student session='Tổng công việc'
              value={dataTask.length} context='Tổng số công việc đã tạo' color='var(--main)' status={true} />
          </div>
        </Grid>
        <Grid xs={3} sx={{ position: 'relative' }}>
          <div  >
            <Box_2_Student session='Đã kiểm duyệt' value={g[0].length} context='Tổng số công việc đã kiểm duyệt' color='var(--main)' />
          </div>
        </Grid>
        <Grid xs={3} sx={{ position: 'relative' }}>
          <div  >
            <Box_2_Student session='Đã hoàn thành' value={g[1].length} context='Tổng số công việc hoàn thành chưa duyệt' color='#38d200' />
          </div>
        </Grid>
        <Grid xs={3} sx={{ position: 'relative' }}>
          <div  >
            <Box_2_Student session='Đang thực hiện' value={g[2].length} context='Tổng số công việc đang thực hiện' color='#f5a623' />
          </div>
        </Grid>
        <Grid xs={12} sx={{ p: 1 }}>
          <Wrap_table dataTasks={dataTask} dataProject={dataProject} dataTaskType={dataTaskType} token={token.value}
            user={user} users={dataUser} />
        </Grid>
      </Grid>
    </>
  );
}

function Box_2_Student({ session, value, context, color, status }) {
  return (
    <>
      <Box sx={{ borderRadius: 2, boxShadow: 'var(--box)', p: 2, bgcolor: 'white', position: 'relative', overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ position: 'relative', zIndex: 1, color: status ? 'white' : 'var(--text)' }}>
          <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', height: '100%', color: 'inherit' }}>
            <p className="text_4_m" style={{ color: 'inherit' }}> {session} </p>
            <p className="text_1_s" style={{ margin: '6px 0', color: 'inherit' }}>{value}</p>
            <p className="text_4_m" style={{ color: 'inherit' }}>{context}</p>
          </div>
        </Box>
        <div style={{ width: status ? '100%' : 5, background: `${color}`, position: 'absolute', top: 0, right: 0, height: '100%', zIndex: 0, transition: 'all .2s linear' }}></div>
      </Box>
    </>
  );
};
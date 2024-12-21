import Box from '@mui/material/Box'
import { Project_Read_One, Department_Read_all, User_Read_all } from '@/app/data'
import Main from './ui/Project_ID_Read/main'
import '@/style/index.css'

export default async function Page({ params }) {

  const { id } = params
  const data = await Project_Read_One(id)
  const department = await Department_Read_all()
  const user = await User_Read_all()

  return (
    <Box
      sx={{
        height: 'calc(100vh - 40px)',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
      className="Wrap_Scroll_n"
    >
      <Main project={data} department={department} user={user} />
    </Box>)
}

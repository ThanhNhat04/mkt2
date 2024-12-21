import Course_sideBar from '@/components/UI/(Course)/Course_sideBar';
import { Project_Read_all, Department_Read_all, Project_Read_Status } from '@/app/data';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function CoursePage() {
  const cookieStore = cookies();
  const token = cookieStore.get('airobotic');
  const user = jwt.verify(token.value, process.env.JWT_SECRET)
  let data = await Project_Read_all()
  let department = await Department_Read_all()
  let statusProject = Project_Read_Status()

  return (
    <Course_sideBar data={data} department={department} statusProject={statusProject} user={user} token={token} />
  );
}

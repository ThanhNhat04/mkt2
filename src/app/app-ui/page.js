import Tool_Create from './ui/Tool_Create';
import { Tool_Read_all } from '@/app/data';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default async function ToolPage() {
  let data = await Tool_Read_all()
  const cookieStore = cookies();
  const token = cookieStore.get('airobotic');
  const user = jwt.verify(token.value, process.env.JWT_SECRET)
  return (
    <>
      <Tool_Create data={data} user={user} />
    </>
  );
}
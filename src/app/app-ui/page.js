import Tool_Create from './ui/Tool_Create';
import { Tool_Read_all } from '@/app/data';


export default async function ToolPage() {
  let data = await Tool_Read_all()

  return (
    <>
      <Tool_Create data={data} />
    </>
  );
}
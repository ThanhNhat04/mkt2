import { Found_Read_all, Task_Read_Type } from '@/app/data'
import Main from './main'

export default async function Page({ }) {
  const fount = await Found_Read_all()
  const prompt = await Task_Read_Type()
  return (
    <Main fount={fount} dbprompt={prompt}/>
  )
}


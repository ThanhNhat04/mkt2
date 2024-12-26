import { Task_Read_Type } from '@/app/data'
import Main from './main'

export default async function Page({ }) {
  const prompt = await Task_Read_Type()
  return (
    <Main dbprompt={prompt} />
  )
}
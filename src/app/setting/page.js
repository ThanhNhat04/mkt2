import { Found_Read_all } from '@/app/data'
import Main from './main'

export default async function Page({ }) {
  const fount = await Found_Read_all()
  return (
    <Main fount={fount} />
  )
}


import { User_Read_all } from '@/app/data'
import UserList from './ui/wraplist';

export default async function Page_Personnel() {
  let data = await User_Read_all()

  return (
    <>
      <UserList data={data} />
    </>
  );
}
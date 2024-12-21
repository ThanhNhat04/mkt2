import RoleList from '@/components/UI/(Personnal)/RoleList';
import UserList from '@/components/UI/(Personnal)/UserList';
import fetchApi from '@/utils/API_suport/fetchData';

export default async function Page_Personnel() {
  let allUser;
  try {
    allUser = await fetchApi('/user', { method: 'POST', body: JSON.stringify({ source: 1 }) })
  } catch (error) {
    allUser = null
  }
  console.log(allUser);

  return (
    <>
      {/* <RoleList data={allUser} per={allPer} /> */}
      {/* <UserList data={allUser} /> */}
    </>
  );
}
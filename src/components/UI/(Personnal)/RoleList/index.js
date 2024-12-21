import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Personnal_Add_Role from '../Add/Role'

export default function RoleList({ per, data }) {
  const validUsers = data.filter(
    (element) => typeof element.Role === 'object' && !Array.isArray(element.Role)
  );

  const usersByRole = getRoleData(per, validUsers);

  return (
    <Box sx={{ mb: 2 }}>
      <div
        style={{
          padding: 16,
          background: 'white',
          borderRadius: 8,
          boxShadow: 'var(--box)',
        }}
      >
        <p className="text_2" style={{ paddingBottom: 12 }}>
          Danh sách quyền hạn
        </p>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {usersByRole.map((role, index) => (
            <Box
              key={index}
              sx={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <Box>
                <p className='text_3_m' style={{ paddingBottom: 12 }}> Chức vụ: {role.title} </p>
                <p className='text_3' style={{ paddingBottom: 12, paddingLeft: 6 }}>{role.subTitle}</p>
                <p className='text_4_m' style={{
                  padding: '5px 13px', background: 'var(--main)', borderRadius: 8, color: 'white',
                  width: 'max-content', cursor: 'pointer'
                }}>
                  Sửa quyền hạn
                </p>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AvatarGroup
                  max={3}
                  sx={{ '& .MuiAvatarGroup-avatar': { width: 32, height: 32, fontSize: '0.875rem' } }}
                >
                  {role.users.map((user, i) =>
                    typeof user === 'string' && user.length === 1 ? (
                      <Avatar key={i} sx={{ width: 32, height: 32 }}>{user} </Avatar>
                    ) : (
                      <Avatar key={i} src={user} sx={{ width: 32, height: 32 }} />
                    )
                  )}
                </AvatarGroup>
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',

            }}
          ><Personnal_Add_Role />
          </Box>
        </Box>
      </div>
    </Box>
  );
}

function getRoleData(permissions, users) {
  const permissionMap = new Map();
  permissions.forEach((permission) => {
    permissionMap.set(permission.ID, permission.Name);
  });
  const roleGroups = {};

  users.forEach((user) => {
    Object.keys(user.Role).forEach((roleId) => {
      if (permissionMap.has(roleId)) {
        if (!roleGroups[roleId]) {
          roleGroups[roleId] = {
            title: permissionMap.get(roleId),
            users: [],
          };
        }
        roleGroups[roleId].users.push(user.Avt || user.Name.charAt(0));
      }
    });
  });
  return permissions.map((permission) => {
    const group = roleGroups[permission.ID] || { users: [] };
    return {
      title: permission.Name,
      subTitle: `${group.users.length} Người dùng`,
      users: group.users,
    };
  });
}

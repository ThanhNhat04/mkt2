export function getUserByProject(user, project, task) {
  let g = null;

  // Tìm project phù hợp với task.project
  for (let i in project) {
    if (project[i]._id == task.project) {
      g = project[i];
      break;
    }
  }

  // Nếu không tìm thấy project, trả về null
  if (!g || !g.members) {
    return null;
  }

  // Kiểm tra nếu leader là ObjectID hoặc mảng, chuẩn hóa thành mảng
  const leaderArray = g.leader
    ? Array.isArray(g.leader) 
      ? g.leader 
      : [g.leader]
    : []; // Nếu không có leader, đặt thành mảng rỗng

  const allUserIds = new Set([
    task.doer,
    task.checker,
    ...leaderArray,
    ...g.members
  ]);

  const userMap = user.reduce((acc, user) => {
    acc[user._id] = user;
    return acc;
  }, {});

  return Array.from(allUserIds).map(userId => {
    const u = userMap[userId];
    if (u) {
      return { _id: u._id, Name: u.Name };
    } else {
      return null;
    }
  }).filter(Boolean);
}


export function setValueInpue(data, label, value) {
  return data.map(item => ({
    label: item[`${label}`],
    value: item[`${value}`]
  }));
}

export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFtoF(ids, users, atr) {
  const idArray = Array.isArray(ids) ? ids : [ids];
  return users.filter(user => idArray.includes(user[`${atr}`]));
}

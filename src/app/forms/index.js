export function Update_taskclone({ id, name, type, optype, doer, opdoer, startDate, endDate, detail, notes }) {
  return [
    {
      type: 'input',
      name: 'id',
      label: 'id',
      defaultValue: id,
    },
    {
      type: 'input',
      name: 'name',
      label: 'Tên công việc',
      defaultValue: name,
      required: true,
    },
    {
      type: 'select',
      name: 'taskCategory',
      label: 'Loại công việc',
      required: true,
      defaultValue: type || '',
      options: optype,
    },
    {
      type: 'select',
      name: 'doer',
      label: 'Người thực hiện',
      required: true,
      defaultValue: doer,
      options: opdoer,
    },
    {
      type: 'date',
      name: 'startDate',
      label: 'Thời gian bắt đầu',
      defaultValue: startDate,
      required: true,
    },
    {
      type: 'date',
      name: 'endDate',
      label: 'Thời gian kết thúc',
      defaultValue: endDate,
      required: true,
    },
    {
      type: 'textarea',
      name: 'detail',
      label: 'Chi tiết công việc',
      defaultValue: detail,
      required: true,
    },
    {
      type: 'textarea',
      name: 'notes',
      defaultValue: notes,
      label: 'Ghi chú',
    },
  ];
}
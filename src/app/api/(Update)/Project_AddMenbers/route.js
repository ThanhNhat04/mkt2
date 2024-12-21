import connectDB from '@/config/database'
import PostProject from '@/models/postProject'
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    // Xác thực người dùng
    const { user, body } = await authenticate(request)
    // Kết nối DB
    await connectDB();

    // Lấy dữ liệu từ body
    const { members, role, project } = body

    if (!members || role == undefined) {
      return NextResponse.json({ air: 1, mes: 'Thiếu dữ liệu', data: null }, { status: 400 })
    }

    const Project = await PostProject.findOne({ _id: project });
    if (!Project) return NextResponse.json({ air: 1, mes: 'Dự án không tồn tại', data: null }, { status: 400 })
    if (!Project.leader.includes(user.id)) {
      return NextResponse.json({ air: 1, mes: 'Bạn không có quyền thêm thành viên vào dự án' }, { status: 400 })
    }
    if (role == 1) {
      updatedProject = await PostProject.findOneAndUpdate(
        { _id: project },
        { $addToSet: { leader: members } },
        { new: true }
      );
    } else if (role == 0) {
      updatedProject = await PostProject.findOneAndUpdate(
        { _id: project },
        { $addToSet: { members: members } },
        { new: true }
      );
    } else {
      return NextResponse.json(
        { air: 1, mes: 'Role không hợp lệ', data: null },
        { status: 400 }
      );
    }


    // const updatedTask = await PostTask.findOneAndUpdate(
    //   { _id: taskId },
    //   { $push: { subTask: subTask } },
    //   { new: true }
    // );

    return NextResponse.json({ air: 2, mes: 'Thêm thành viên thành công', data: updatedProject}, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}

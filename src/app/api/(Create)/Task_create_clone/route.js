import connectDB from '@/config/database'
import PostTask from "@/models/postTask"
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
    const { taskId, subTask } = body

    if (!taskId || !subTask) {
      return NextResponse.json(
        { air: 1, mes: 'Thiếu dữ liệu taskId hoặc subTask', data: null },
        { status: 400 }
      )
    }

    // Nếu không phải Quản lý, chỉ được cập nhật task mà user là doer
    let filter = { _id: taskId };
    if (user.role !== 'Quản lý') {
      filter.doer = user.id;
    }

    // Kiểm tra xem task có tồn tại và user có quyền hay không
    const existingTask = await PostTask.findOne(filter);
    if (!existingTask) {
      return NextResponse.json(
        { air: 1, mes: 'Task không tồn tại hoặc bạn không có quyền cập nhật task này', data: null },
        { status: 404 }
      );
    }

    // Đảm bảo subTask con không chứa trường subTask lồng nhau
    if ('subTask' in subTask) {
      delete subTask.subTask;
    }

    // Thêm subTask (nếu chưa có subTask, $push sẽ tạo mới field subTask)
    const updatedTask = await PostTask.findOneAndUpdate(
      { _id: taskId },
      { $push: { subTask: subTask } },
      { new: true }
    );

    return NextResponse.json(
      { air: 2, mes: 'Cập nhật dữ liệu thành công', data: updatedTask },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}

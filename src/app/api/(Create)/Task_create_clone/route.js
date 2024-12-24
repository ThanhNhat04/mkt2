import connectDB from '@/config/database'
import PostTask from "@/models/postTask"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose';

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    const { taskId, subTask } = body
    if (!taskId || !subTask) { return NextResponse.json({ air: 1, mes: 'Thiếu dữ liệu', data: null }, { status: 400 }) }

    let filter = { _id: taskId };
    if (user.role !== 'Quản lý') filter.doer = user.id

    const existingTask = await PostTask.findOne(filter);
    if (!existingTask) {
      return NextResponse.json(
        { air: 1, mes: 'Task không tồn tại hoặc bạn không có quyền cập nhật task này', data: null },
        { status: 404 }
      );
    }

    const ID = new mongoose.Types.ObjectId();
    subTask._id = ID
    subTask.done = false

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

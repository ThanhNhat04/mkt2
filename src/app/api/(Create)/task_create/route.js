import connectDB from '@/config/database'
import PostTask from "@/models/postTask"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    const { _id, foundation } = body
    const existingTask = await PostTask.findOne({ _id: _id });
    if (!existingTask) {
      return NextResponse.json(
        { air: 1, mes: 'Task không tồn tại hoặc bạn không có quyền cập nhật task này', data: null },
        { status: 404 }
      );
    }

    const updatedTask = await PostTask.findOneAndUpdate(
      { _id: _id },
      { foundation: foundation },
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

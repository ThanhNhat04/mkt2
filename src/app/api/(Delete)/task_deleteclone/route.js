import PostTask from '@/models/postTask'
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'
import connectDB from "@/config/database"
import mongoose from 'mongoose'
const { ObjectId } = mongoose.Types

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    // Xác thực request
    const { user, body } = await authenticate(request)
    const { id, subId } = body
    console.log(new ObjectId(subId));

    // Kết nối DB
    await connectDB()

    // Thực hiện xóa subtask bằng cách $pull phần tử có _id = subId
    const updated = await PostTask.findByIdAndUpdate(
      id,
      { $pull: { subTask: { _id: new ObjectId(subId) } } },
      { new: true } // Trả về document sau khi update
    )

    // Nếu không tìm thấy document
    if (!updated) {
      return NextResponse.json(
        { air: 0, mes: 'Không tìm thấy dữ liệu', data: null },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { air: 2, mes: 'Xóa thành công', data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}

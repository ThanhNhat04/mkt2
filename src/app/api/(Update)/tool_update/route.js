import connectDB from '@/config/database'
import PostTool from "@/models/postTool"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function PUT(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    // Lấy dữ liệu từ body
    const { id, Name, Description, Image, Tool, Tag } = body

    if (!id || !Name || !Description || !Image || !Tool || !Tag) {
      return NextResponse.json(
        { air: 1, mes: 'Thiếu dữ liệu', data: null },
        { status: 400 }
      )
    }

    // Kiểm tra quyền của người dùng
    if (user.role !== 'Quản lý') {
      return NextResponse.json(
        { air: 1, mes: 'Bạn không có quyền cập nhật tool', data: null },
        { status: 403 }
      )
    }

    // Cập nhật tool theo ID
    const updatedTool = await PostTool.findByIdAndUpdate(id, {
      Name,
      Description,
      Image,
      Tool,
      Tag
    }, { new: true });

    if (!updatedTool) {
      return NextResponse.json(
        { air: 1, mes: 'Tool không tồn tại', data: null },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { air: 2, mes: 'Cập nhật dữ liệu thành công', data: updatedTool },
      { status: 200 }
    );

  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}
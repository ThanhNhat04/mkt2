import connectDB from '@/config/database'
import PostTool from "@/models/postTool"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    // Lấy dữ liệu từ body
    const { Name, Description, Image, Tool, Tag } = body

    if (!Name || !Description || !Image || !Tool || !Tag) {
      return NextResponse.json(
        { air: 1, mes: 'Thiếu dữ liệu', data: null },
        { status: 400 }
      )
    }

    // Kiểm tra quyền của người dùng
    if (user.role !== 'Quản lý') {
      return NextResponse.json(
        { air: 1, mes: 'Bạn không có quyền tạo tool mới', data: null },
        { status: 403 }
      )
    }
    // Thêm subTool (nếu chưa có subTool, $push sẽ tạo mới field subTool)
    const newTool = new PostTool({
      Name,
      Description,
      Image,
      Tool,
      Tag
    });

    // Lưu tool mới vào cơ sở dữ liệu
    const savedTool = await newTool.save();

    return NextResponse.json(
      { air: 2, mes: 'Tạo mới dữ liệu thành công', data: savedTool },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}

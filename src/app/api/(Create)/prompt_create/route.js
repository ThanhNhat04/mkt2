import connectDB from '@/config/database'
import PostPrompt from "@/models/postPrompt"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    // Lấy dữ liệu từ body
    const { name, prompt, tag } = body

    if (!name || !prompt || !tag) {
      return NextResponse.json(
        { air: 1, mes: 'Thiếu dữ liệu', data: null },
        { status: 400 }
      )
    }

    // Kiểm tra quyền của người dùng
    // if (user.role !== 'Quản lý') {
    //   return NextResponse.json(
    //     { air: 1, mes: 'Bạn không có quyền tạo prompt mới', data: null },
    //     { status: 403 }
    //   )
    // }

    const newPrompt = new PostPrompt({
      name,
      prompt,
      tag
    });

    const savedPrompt = await newPrompt.save();

    return NextResponse.json(
      { air: 2, mes: 'Tạo mới dữ liệu thành công', data: savedPrompt },
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

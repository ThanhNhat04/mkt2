import connectDB from '@/config/database'
import PostFoundation from "@/models/postFoundation"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)
    await connectDB();
    const { name, description, banner, link, type } = body

    if (!name || !description || !banner || !link || !type) {
      return NextResponse.json(
        { air: 1, mes: 'Thiếu dữ liệu', data: null },
        { status: 400 }
      )
    }
    if (user.role !== 'Quản lý') {
      return NextResponse.json(
        { air: 1, mes: 'Bạn không có quyền tạo tool mới', data: null },
        { status: 403 }
      )
    }
    const newFound = new PostFoundation({
      name,
      description,
      banner,
      link,
      type
    });

    const savedFound = await newFound.save();

    return NextResponse.json(
      { air: 2, mes: 'Tạo mới dữ liệu thành công', data: savedFound },
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

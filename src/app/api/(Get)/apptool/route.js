import connectDB from '@/config/database'
import PostTool from "@/models/postTool"
import { NextResponse } from 'next/server'

export const preferredRegion = process.env.area

export async function POST() {
  try {
    let data
    let message = 'Lấy dữ liệu thành công'
    let status = 200
    await connectDB();
    data = await PostTool.find({})
    return NextResponse.json(
      { air: status === 200 ? 2 : 1, mes: message, data },
      { status }
    );
  } catch (error) {
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}
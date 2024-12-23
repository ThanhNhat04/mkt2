import connectDB from '@/config/database'
import PostProject from "@/models/postProject"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { user, body } = await authenticate(request)

    console.log(user);
    const { project } = body
    console.log(project);
    let data;
    let message = 'Lấy dữ liệu thành công'
    let status = 200
    await connectDB();

    data = await PostProject.findOne({ _id: project });
    if (data.leader.includes(user.id) || data.members.includes(user.id)) {
      return NextResponse.json(
        { air: status === 200 ? 2 : 1, mes: message, data },
        { status }
      );
    } else {
      return NextResponse.json(
        { air: 1, mes: 'Bạn không có quyền truy cập dữ liệu này', data: null },
        { status }
      );
    }
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: error.message === 'Authentication failed' ? 401 : 500 }
    )
  }
}
import PostTool from "@/models/postTool"
import { authenticate } from '@/utils/authenticate'
import { NextResponse } from 'next/server'
import connectDB from "@/config/database"
export const preferredRegion = process.env.area


export async function DELETE(request) {
    try {
      const { user,body } = await authenticate(request)
  
      if (user.role !== 'Quản lý') {
        return NextResponse.json(
          { air: 0, mes: 'Không có quyền xóa', data: null },
          { status: 403 }
        )
      }
  
      const { id } = body
      await connectDB();
      const result = await PostTool.findByIdAndDelete(id);
  
      if (!result) {
        return NextResponse.json(
          { air: 0, mes: 'Không tìm thấy dữ liệu', data: null },
          { status: 404 }
        )
      }
  
      return NextResponse.json(
        { air: 2, mes: 'Xóa thành công', data: result },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { air: 0, mes: error.message, data: null },
        { status: error.message === 'Authentication failed' ? 401 : 500 }
      )
    }
  }
import { NextResponse } from 'next/server';
import dbConnect from '@/config/database';
import PostUser from '@/models/postUser';
import { authenticate } from '@/utils/authenticate';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// API kiểm tra token và trả về thông tin người dùng
export async function POST(request) {
  try {
    const { user } = await authenticate(request);

    if (!user) {
      return NextResponse.json(
        { air: 0, mes: 'Xác thực thất bại!' },
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    await dbConnect();

    const users = await PostUser.findOne({ _id: user.id }, { Name: 1, Avt: 1, Role: 1 });
    if (!users) {
      return NextResponse.json(
        { air: 0, mes: 'Người dùng không tồn tại!' },
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return NextResponse.json(
      { air: 2, mes: 'Lấy thông tin người dùng thành công!', data: users },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { air: 0, mes: 'Đã xảy ra lỗi trong quá trình xử lý!', error: error.message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

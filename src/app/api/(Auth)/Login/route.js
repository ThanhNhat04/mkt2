import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/config/database';
import PostUser from '@/models/postUser';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    try {
      const response = await fetch('https://api-auth.s4h.edu.vn/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return new Response(JSON.stringify({ air: 0, data: null, mes: 'Tài khoản hoặc mật khẩu không chính xác' }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json', },
        });
      }

      let data = await response.json();

      const checkuser3 = await fetch('https://api-auth.s4h.edu.vn/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.accessToken}`
        },
      })

      if (!checkuser3.ok) {
        let errorResponse = await checkuser3.json();
        return new Response(JSON.stringify({ air: 0, data: null, error: errorResponse.error }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json', },
        });
      }

      data = await PostUser.findOne({ Email: email })
      if (!data) {
        data = await checkuser3.json()
        const newPost = new PostUser({
          Email: email,
          Name: data.lastName + ' ' + data.firstName,
          Phone: data.phone ? data.phone : '',
          Address: data.address ? data.address : '',
          Avatar: data.avatarUrl ? data.avatarUrl : '',
          Role: 'Nhân viên'
        });
        await newPost.save();
        data = newPost
      }

      const accessToken = jwt.sign({ id: data._id, role: data.Role }, process.env.JWT_SECRET);

      const cookieStore = cookies();
      cookieStore.set('airobotic', accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365 * 10
      });
      return new Response(JSON.stringify({ air: 0, data, mes: 'Đăng nhập thành công' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error occurred while calling the API' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // const PostPer = await PostPermission.findOne({ ID: Object.keys(userObject.Role)[0] }, { _id: 0 });
    // const accessToken = jwt.sign({ userId: userObject._id, role: PostPer }, process.env.JWT_SECRET);

    // // Lấy domain từ header của request
    // const origin = request.headers.get('origin');
    // const domain = new URL(origin).hostname;

    // const cookieStore = cookies();
    // cookieStore.set('u', accessToken, {
    //   httpOnly: true,
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 365 * 10,
    //   domain: domain === 'localhost' ? undefined : domain, // Không đặt domain nếu là localhost
    // });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


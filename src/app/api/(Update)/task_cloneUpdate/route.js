import PostTask from "@/models/postTask";
import { authenticate } from "@/utils/authenticate";
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export async function POST(request) {
  try {
    // Xác thực request
    const { user, body } = await authenticate(request);

    // Lấy dữ liệu từ body
    const { id, data } = body; // id là document cha, data là thông tin subtask
    const { id: subId, ...updateFields } = data; // subId là _id của subtask

    // Kết nối database
    await connectDB();

    // Tạo object $set
    const setObject = {};
    for (const [key, value] of Object.entries(updateFields)) {
      setObject[`subTask.$.${key}`] = value;
    }

    // Cập nhật subtask
    const updated = await PostTask.findOneAndUpdate(
      { _id: id, "subTask._id": new ObjectId(subId) }, // Tìm document cha và subtask dựa vào _id
      { $set: setObject }, // Cập nhật các trường của subtask
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updated) {
      return NextResponse.json(
        { air: 0, mes: "Không tìm thấy document hoặc subtask", data: null },
        { status: 404 }
      );
    }

    // Trả về kết quả thành công
    return NextResponse.json(
      { air: 2, mes: "Chỉnh sửa thành công", data: updated },
      { status: 200 }
    );
  } catch (error) {
    // Xử lý lỗi
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: 500 }
    );
  }
}

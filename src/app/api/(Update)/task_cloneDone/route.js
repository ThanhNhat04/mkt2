import PostTask from "@/models/postTask";
import { authenticate } from "@/utils/authenticate";
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export async function POST(request) {
  try {
    // Xác thực người dùng
    const { user, body } = await authenticate(request);

    const { id, subId } = body;

    // Kết nối tới database
    await connectDB();

    // Tìm document cha và subtask có _id tương ứng
    const document = await PostTask.findOne({
      _id: id,
      "subTask._id": new ObjectId(subId),
    });

    if (!document) {
      return NextResponse.json(
        { air: 0, mes: "Không tìm thấy document hoặc subtask", data: null },
        { status: 404 }
      );
    }

    // Kiểm tra xem `done` đã là true chưa
    const subTask = document.subTask.find(
      (task) => task._id.toString() === subId
    );

    if (subTask.done) {
      return NextResponse.json(
        { air: 0, mes: "Trường 'done' đã là true, không thể cập nhật", data: null },
        { status: 400 }
      );
    }

    // Cập nhật trường `done` thành true
    const updated = await PostTask.findOneAndUpdate(
      { _id: id, "subTask._id": new ObjectId(subId) }, // Tìm document và subtask
      { $set: { "subTask.$.done": true } }, // Cập nhật chỉ trường `done`
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { air: 0, mes: "Không thể cập nhật dữ liệu", data: null },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { air: 2, mes: "Cập nhật thành công", data: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { air: 0, mes: error.message, data: null },
      { status: 500 }
    );
  }
}

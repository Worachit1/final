import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/todo";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// CREATE สร้างงานใหม่
export async function POST(request: Request) {
  try {
    const { amount, date, type, notes } = await request.json();
    await connectToDatabase();
    const newTransaction = new Transaction({
      amount,
      date,
      type,
      notes,
    });
    await newTransaction.save();
    return NextResponse.json({ success: true, data: newTransaction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// READ แสดงรายการงานทั้งหมด
export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await Transaction.find({});
    return NextResponse.json({ success: true, data: transactions });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// UPDATE แก้ไขข้อมูล
export async function PUT(request: Request) {
  try {
    const { id, amount, date, type, notes } = await request.json();
    await connectToDatabase();
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, type, notes },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedTransaction });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// DELETE ลบงาน
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectToDatabase();
    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}
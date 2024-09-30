import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },  // จำนวน
  date: { type: Date, required: true },      // วันที่
  type: { type: String, enum: ['income', 'expense'], required: true },  // ประเภท (รายรับหรือรายจ่าย)
  notes: { type: String, required: false },   // โน้ตสำหรับบันทึกรายละเอียด
});  // ใช้ collection 'revenue'

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;
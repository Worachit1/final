"use client";
import React, { useState, useEffect } from "react";
import styles from "../app/style.css";
import Link from "next/link";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  type: string; // รายรับหรือรายจ่าย
  notes: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    date: "",
    type: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null); // สถานะการแก้ไข

  // Fetch all transactions (READ)
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/final", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // Create or update transaction
  const saveTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.date || !newTransaction.type) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const method = editingTransactionId ? "PUT" : "POST"; // ใช้ PUT ถ้ามีการแก้ไข
      const res = await fetch("/api/final", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTransaction,
          amount: Number(newTransaction.amount), // แปลงเป็นเลขก่อนส่ง
          id: editingTransactionId, // ถ้ามีการแก้ไข
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (editingTransactionId) {
          // ถ้ามีการแก้ไข
          setTransactions(transactions.map(t => (t._id === editingTransactionId ? data.data : t)));
        } else {
          setTransactions([...transactions, data.data]);
        }
        // Reset form
        setNewTransaction({ amount: "", date: "", type: "", notes: "" });
        setEditingTransactionId(null); // Clear editing status
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  // Start editing a transaction
  const editTransaction = (transaction: Transaction) => {
    setNewTransaction({
      amount: transaction.amount.toString(),
      date: transaction.date,
      type: transaction.type,
      notes: transaction.notes,
    });
    setEditingTransactionId(transaction._id); // ตั้งค่า id สำหรับการแก้ไข
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch("/api/final", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Calculate total balance
  const calculateTotalBalance = () => {
    let total = 0;
    transactions.forEach(transaction => {
      if (transaction.type === "income") {
        total += transaction.amount; // เพิ่มสำหรับรายรับ
      } else if (transaction.type === "expense") {
        total -= transaction.amount; // ลดสำหรับรายจ่าย
      }
    });
    return total;
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className={styles.page}>
     
      <h1>income expense</h1>
      <h2>money: {calculateTotalBalance()} บาท</h2> {/* Display total balance */}

      {/* Create or edit transaction */}
      <div className={styles.createTransaction}>
        <h2>{editingTransactionId ? "แก้ไขบัญชี" : ""}</h2>
        <h3>จำนวนเงิน</h3>
        <input
          type="number"
          placeholder="จำนวนเงิน (บาท)"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
        />
        <h3>วัน/เดือน/ปี</h3>
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
        />
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="" disabled>ประเภท</option>
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
        <h3>description</h3>
        <textarea
          value={newTransaction.notes}
          onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
        />
        <button onClick={saveTransaction}>{editingTransactionId ? "update" : "add task"}</button>
      </div>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display all transactions */}
      <div className={styles.transactionList}>
        <h2>รายชื่อ</h2>
        {transactions.length === 0 ? (
          <p>none</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id} className={styles.transactionItem}>
                <h3>{transaction.type === "income" ? "income " : "expense "}: {transaction.amount} บาท</h3> {/* Display in Baht */}
                <p>วันที่: {new Date(transaction.date).toLocaleDateString()}</p>
                <p>รายละเอียด: {transaction.notes}</p>
                <button className={styles.editButton} onClick={() => editTransaction(transaction)}>แก้ไข</button>
                <button className={styles.deleteButton} onClick={() => deleteTransaction(transaction._id)}>ลบ</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

// CRUD => CREATE UPDATE 
// READ data
// url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Transaction.find({});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}
// Create
// req => {name: "", note: ""}
// url => api/v1/todo/id
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation checks
    if (!body.name || body.money == null || !body.description || !body.duedate) {
      return NextResponse.json({
        error: "All fields are required.",
      }, { status: 400 });
    }

    const res = await Transaction.create(body); // Ensure the body includes money
    return NextResponse.json({ data: res });
  } catch (error) {
    console.error("Error creating todo:", error); // Log the error for debugging
    return NextResponse.json({
      error: error || "An error occurred",
    }, { status: 500 });
  }
}


// Update
export async function PUT(req: NextRequest){
  try {
    const body = await req.json();
    const res = await Transaction.updateOne(body);
    return NextResponse.json({data: res});
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}
// Delete
export async function DELETE(req: NextRequest){
  try {
    const body = await req.json();
    const res = await Transaction.deleteOne(body);
    return NextResponse.json({data: res});
    }catch(error){
      return NextResponse.json({
        error: error,
      });
    }
}



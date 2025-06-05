import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Cart";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {_id, userID, productID, quantity} = data

      const saveData = await Product.findOneAndUpdate({_id: _id, userID : userID, productID : productID} , { quantity : quantity  }  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "cart updated successfully!" });

      } else {

        return NextResponse.json({ success: false, message: "Failed to update the cart. Please try again!" });

      }

    } else {

      return NextResponse.json({ success: false, message: "You are not authorized." });

    }

  } catch (error) {

    console.log('Error in update a new product :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const data = await req.json();
      const  {_id, quantity} = data
console.log('Datas pour mise à jour de la quantité du produit :', data);
      const saveData = await Product.findOneAndUpdate({_id: _id} , { productQuantity : quantity }  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "product quantity updated successfully!" });

      } else {

        return NextResponse.json({ success: false, message: "Failed to update the product quantity. Please try again!" });

      }

    } else {

      return NextResponse.json({ success: false, message: "You are not authorized." });

    }

  } catch (error) {

    console.log('Error in update a product quantity:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}

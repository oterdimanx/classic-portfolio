import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import User from "@/model/User";

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
    await connectDB();
  try {
      const isAuthenticated = await AuthCheck(req);
      if (!isAuthenticated) {
        return NextResponse.json({ success: false, message: "You are not authorized Please login!"});
      }
      const data = await req.json();
      //console.log('Datas pour mise à jour d\'une commande :', data);

      const {
        _id: { orderId },
        paypalOrderId: { paypalOrderId },
        isPaid: { isPaid }
      } = data;

      //console.log('Update Order with paypalOrderId for the order : ' + orderId)
      const saveData = await Order.findOneAndUpdate({_id: orderId} , { paypalOrderId : paypalOrderId, isPaid : isPaid  }  , { new: true });

      if (saveData) {
        return NextResponse.json({ success: true, message: "order updated successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the order . Please try again!" });
      }
  } catch (error) {

    console.log('Error in update an order :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}

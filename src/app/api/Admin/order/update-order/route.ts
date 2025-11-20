import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import Cart from "@/model/Cart";
import Product from "@/model/Product";
import Joi from "joi";

export const dynamic = 'force-dynamic'

const createOrderSchema = Joi.object({
    user: Joi.string().required(),
})

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
            //console.log(data)
            const { user } = saveData;
            const { error } = createOrderSchema.validate({ user });

            if(isPaid){

              // Mise à jour des quantités des produits achetés avec Promise.all
              try {
                const updatePromises = saveData.orderItems.map((item: { product: any; qty: number; }) => 
                  Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { productQuantity: -item.qty } },
                    { new: true }
                  )
                );
                
                await Promise.all(updatePromises);
                console.log('All product quantities updated successfully');
                
              } catch (error) {
                console.error('Error updating product quantities:', error);
              }

              //console.log('Order :', saveData.orderItems);
              const deleteData = await Cart.deleteMany({userID: user});
            }
            
        return NextResponse.json({ success: true, message: "order updated successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to update the order . Please try again!" });
      }
  } catch (error) {

    console.log('Error in update an order :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}

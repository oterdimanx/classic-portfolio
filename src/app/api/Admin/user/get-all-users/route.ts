import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import AuthCheck from "@/middleware/AuthCheck";
import User from "@/model/User";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {

    const registerUserModel =  await User.init();

    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const getData = await User.find({});
      if (getData) {
        return NextResponse.json({ success: true, data: getData });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'No user found.' });
      }

    } else {
      return NextResponse.json({ success: false, message: "You are not authorized Please login!" });
    }


  } catch (error) {
    console.log('Error in getting all Users :', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}

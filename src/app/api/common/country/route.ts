import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Country from "@/model/Country";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const getData = await Country.find({})
    if (getData) {
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'No countries found.' });
    }
  } catch (error) {
    console.log('Error in getting all countries:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}
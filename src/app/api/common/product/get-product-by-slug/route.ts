import connectDB from "@/DB/connectDB";
import { NextResponse } from "next/server";
import Product from "@/model/Product";
import Category from "@/model/Category";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ status: 400, success: false, message: 'Please provide Product slug.' });

    const registerCategoryModel = await Category.init();
console.log(slug)
    const getData = await Product.findOne({productSlug: slug}).populate('productCategory', ' categoryName categorySlug _id')
    if (getData) {
      return NextResponse.json({ success: true, data: getData });
    } else {
      return NextResponse.json({ status: 204, success: false, message: 'No Product found.' });
    }

  } catch (error) {
    console.log('Error in getting  product by id:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Something went wrong. Please try again!' });
  }
}

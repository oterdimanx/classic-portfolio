import { update_order_status } from '@/Services/Admin/order';
import { NextResponse } from 'next/server';
import AuthCheck from "@/middleware/AuthCheck";
import Order from "@/model/Order";

const PAYPAL_API = 'https://api-m.sandbox.paypal.com';  // Switch to 'https://api-m.paypal.com' for live

// Helper to get access token
async function getAccessToken() {
  //console.log('CLIENT_ID (masked):', process.env.PAYPAL_CLIENT_ID?.slice(0, 10) + '...');  // Should print first 10 chars
  //console.log('SECRET (masked):', process.env.PAYPAL_SECRET?.slice(0, 10) + '...');

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    throw new Error('Missing PayPal env vars');
  }

  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
  //console.log('Auth header (masked):', 'Basic ' + auth.slice(0, 10) + '...');

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  //console.log('Token fetch status:', res.status);  // Should be 200
  const data = await res.json();
  //console.log('Token full response:', data);  // Full JSON for errors

  if (!res.ok) throw new Error('Token failed: ' + JSON.stringify(data));
  return data.access_token;
}

// POST: Create PayPal order
export async function POST(req: Request) {

  const { orderData } = await req.json();  // Your finalData (e.g., amount, items)—pass from client
  //console.log ("Creating PayPal order for:", orderData);

  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',  // Adjust currency
          value: 15.00,  // Use orderData.amount or similar
        },
      }],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ id: data.id, orderData: orderData });  // Return PayPal order ID to client
}

// PUT: Capture payment after approval
export async function PUT(req: Request) {
  const { orderId, payerID, myOrderId } = await req.json();

  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payer_id: payerID // Important for backend capture
    })
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to capture payment' }, { status: 500 });
  }

  const data = await res.json();
  if (data.status === 'COMPLETED') {

    console.log('Updating order status for order ID:', myOrderId);
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated) {
      const getData = await Order.find({}).populate("orderItems.product").populate('user');
      if (getData) {
        return NextResponse.json({ success: true, message: "Payment completed" });
      } else {
        return NextResponse.json({ status: 204, success: false, message: 'Payment not completed.' });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized Please login!" });
    }
  }

  return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
}
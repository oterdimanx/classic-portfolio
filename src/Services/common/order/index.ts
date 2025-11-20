
import Cookies from "js-cookie";

export const create_a_new_order = async (formData: any) => {
  try {
    const res = await fetch(`/api/common/order/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    console.log('Data Recovered from creating Order (service) =>', data);
    return data;
  } catch (error) {
    console.log('Error in creating Order (service) =>', error);
  }
}

export const create_a_new_paypal_order = async (formData: any) => {
  try {
    const res = await fetch(`/api/paypal/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in creating Order (service) =>', error);
  }
}

export const get_all_orders_of_user = async (id: any) => {
  try {
    const res = await fetch(`/api/common/order/view-order?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all orders Item for specific User (service) =>', error)
  }
}


export const get_order_details = async (id: any) => {
  try {
    const res = await fetch(`/api/common/order/order-Details?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`
      }
    });
    //console.log(res)
    const data = await res.json();

    return data;
  } catch (error) {
    console.log('Error in getting all orders Item for specific User (service) =>', error)
  }
}

export const update_an_order = async  (orderId: any, paypalOrderId: { paypalOrderId: any; }, isPaid: { isPaid: boolean; }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/Admin/order/update-order`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify({
            _id: orderId,
            paypalOrderId: paypalOrderId,
            isPaid: isPaid,
      }),
    });
     if (!res.ok) {
      throw new Error(`Failed to update order status: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.log('Error in updating Order (service) =>', error);
  }
}
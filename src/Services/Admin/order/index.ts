
import Cookies from "js-cookie";

export const get_all_orders = async () => {
  try {
    const res = await fetch('/api/Admin/order/get-all-order-data', {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('token')}`
        },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in getting all orders (service) =>', error)
  }
}

export const old_update_order_status = async (id : any) => {
  //console.log(id)
  try {
    const res = await fetch(`/api/Admin/order/old-update-order-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id),
    })
    const data = await res.json();
    return data;
  } catch (error) {
    console.log('Error in updating admin order status (service) =>', error)
  }
}

export const update_order_status = async (id: any, payload: { isPaid: boolean; }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/Admin/order/update-order-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${Cookies.get('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...payload }),
    });

    if (!res.ok) {
      throw new Error(`Failed to update order status: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error in updating order status (service) =>', error);
    throw error;
  }
}
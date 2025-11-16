"use client"

import { get_all_orders_of_user } from '@/Services/common/order'
import { RootState } from '@/Store/store'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import OrdersDetailsDataTable from '@/components/OrdersDetailsDataTable'
import { setOrder } from '@/utils/OrderSlice'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { GrDeliver } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'

interface userData {
  email: String,
  role: String,
  _id: String,
  name: String
}

const handleLogout = () => {
  Cookies.remove('token');
  localStorage.clear();
}

export default function Page() {
  const Router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.User.userData) as userData | null

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || !user) {
      handleLogout()
      Router.push('/auth/login?token=expired')
    }
  }, [Router])

  useEffect(() => {
    fetchOrdersData();
  }, [])

  const fetchOrdersData = async () => {
    if (!user?._id) return Router.push('/')
    if (undefined === Cookies.get('token')) return Router.push('/auth/login?token=expired')
    const orderData = await get_all_orders_of_user(user?._id)
    if (orderData?.success) {
      dispatch(setOrder(orderData?.data))
    } else {
      throw new Error(orderData?.message)
    }
  }

  return (
    <>
    <div>
      <Navbar />
    </div>
    <div className="w-full bg-gray-50 h-screen px-2 py-2 font-[Poppin]">
      <div className="text-sm breadcrumbs">
        <ul className="dark:text-black">
          <li>
            <GrDeliver className="w-4 h-4 mr-2 stroke-current" />
            Liste de vos commandes
          </li>
        </ul>
      </div>
      <div className="w-full h-5/6 py-2">
        <OrdersDetailsDataTable />
      </div>
    </div>
    <Footer />
    </>
  )
}
"use client"

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import CartCard from '@/components/CartCard'
import {  get_all_cart_Items } from '@/Services/common/cart'
import { setCart } from '@/utils/CartSlice'
import { setNavActive } from '@/utils/AdminNavSlice'

interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}

type Data = {
    productID: {
        productName: string,
        productPrice: String,
        _id: string,
        productImage: string,
        productQuantity: number,
    }
    userID: {
        email: string,
        _id: string,
    },
    _id: string,
    quantity: number,
}

export default function CartOverlay() {

    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as userData | null
    const cartData = useSelector((state: RootState) => state.Cart.cart) as Data[] | null;
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!Cookies.get('token') || user === null) {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Router])

    useEffect(() => {
        fetchCartData();
    }, [])

    const fetchCartData = async () => {
        if (!user?._id) return Router.push('/')
        if (undefined === Cookies.get('token')) {
            Cookies.remove('token');
            localStorage.clear();
            return Router.push('/auth/login?token=expired')
        }
        const cartData = await get_all_cart_Items(user?._id)
        if (cartData?.success) {
            dispatch(setCart(cartData?.data))
        } else {
            if(cartData?.message?.includes('not authorized Please login')){
                Cookies.remove('token');
                localStorage.clear();
                return Router.push('/auth/login?token=expired')
            }
        }
        setLoading(false)
    }


    function calculateTotalPrice(myCart: Data[]) {
        const totalPrice = myCart?.reduce((acc, item) => {
            return acc + (Number(item?.quantity) * Number(item?.productID?.productPrice));
        }, 0);

        return totalPrice;
    }

    const totalPrice = calculateTotalPrice(cartData as Data[])

    return (
        <>
        <div className="w-full h-full bg-white px-2 font-[Poppin]">
            {
                loading || loader ? (
                    <div className="w-full flex-col h-96 flex items-center justify-center">
                        <TailSpin
                            height="50"
                            width="50"
                            color="orange"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                        <p className="text-sm mt-2 font-semibold text-orange-500">Loading Hold Tight ....</p>
                    </div>
                ) : (

                    <div className="h-full flex-col md:flex-row flex items-start">

                        <div className="px-2 h-full flex-col items-endflex">
                            <div className="overflow-y-auto overflow-x-hidden flex flex-col items-center py-2 overflow-auto h-96">
                                {
                                    cartData?.length === 0 ?
                                        <div className="w-full h-full flex flex-col">
                                            <p className="my-4 mx-2 text-lg font-semibold">No Item Available in Cart</p>
                                            <Link href={"/"} className="btn text-white">Shop Now</Link>
                                        </div>
                                        :
                                        cartData?.map((item: Data) => {
                                            return <CartCard key={item?._id}
                                                productID={item?.productID}
                                                userID={item?.userID}
                                                _id={item?._id}
                                                quantity={item?.quantity}
                                                isOverlay={true}
                                            />
                                        })
                                }
                            </div>
                            <div className="w-full  py-2 my-2 flex justify-end">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Original Price  <span className="text-xl font-extrabold">Rs {totalPrice || 0}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Shipping Price  <span className="text-xl font-extrabold">Rs {500}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  tax Price  <span className="text-xl font-extrabold">Rs {100}</span> </h1>
                            </div>
                            <div className="w-full py-2 my-2 flex justify-end">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Total Order Price  <span className="text-xl font-extrabold">Rs {totalPrice + 600}</span> </h1>
                            </div>
                        </div>

                    </div >


                )
            }

        </div>
        </>
    )
}

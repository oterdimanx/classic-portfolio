"use client"

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import CartCard from '@/components/CartCard'
import {  get_all_cart_Items } from '@/Services/common/cart'
import { setCart } from '@/utils/CartSlice'
import { setNavActive } from '@/utils/AdminNavSlice'
import { create_a_new_order, create_a_new_paypal_order, update_an_order } from '@/Services/common/order'
import Navbar from '@/components/Navbar'
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer'
import _ from 'lodash'
import { get_all_countries } from '@/Services/Admin/country'

type Inputs = {
    fullName: string,
    address: string,
    city: string,
    postalCode: Number,
    country: string,
}

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

export default function Page() {

    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as userData | null
    const cartData = useSelector((state: RootState) => state.Cart.cart) as Data[] | null;
    const [loading, setLoading] = useState(true)
    const [showPaypal, setShowPayPal] = useState(false)
    const [orderId, setOrderId] = useState<string>("")
    type Country = { name: string; flag: string; iso2: string; dialCode: string; }
    const [countries, setCountries] = useState<Country[]>([]);

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
      try {
        const data = await get_all_countries();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } /*finally {
        setLoading(false);
      }*/

        setLoading(false)
    }

    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(true)

        const finalData = {
            user : user?._id,
            orderItems : cartData?.map(item => {
                return {
                    product: item?.productID?._id,
                    qty: item?.quantity
                }
            }),
            shippingAddress : {
                fullName: data?.fullName,
                address: data?.address,
                city: data?.city,
                postalCode: data?.postalCode,
                country: data?.country,
            },
            paymentMethod : 'PayPal',
            itemsPrice : totalPrice,
            taxPrice : 0,
            shippingPrice : 5,
            totalPrice : totalPrice + 0 + 5,
            isPaid : false,
            paidAt : new Date(),
            isDelivered : false,
            deliveredAt : new Date(),
        }

        const res =  await create_a_new_order(finalData);

        if(res?.success){
            toast.success(res?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })

            setShowPayPal(true)
            setOrderId(res?.orderid)
            //console.log("New Order Created with ID:", res?.orderid);
            setLoader(false)
        }else{
            setLoader(false)
            setShowPayPal(false)
            throw new Error(res?.message); 
        }
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
        <div>
          <Navbar />
        </div>
        <div className="w-full h-full bg-white px-2 font-[Poppin]">
            <div className="w-full h-20 my-2 text-center">
                <h1 className="text-2xl py-2 dark:text-black">Votre Commande</h1>
            </div>
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
                        <p className="text-sm mt-2 font-semibold text-orange-500">Chargement en cours....</p>
                    </div>
                ) : (

                    <div className="h-full flex-col md:flex-row flex items-start justify-center -mt-4 relative">

                        <div className="md:w-1/2 px-2 h-full flex-col items-end justify-end flex">
                            <div className="overflow-y-auto overflow-x-hidden w-full flex flex-col items-center py-2 overflow-auto h-96">
                                {
                                    cartData?.length === 0 ?
                                        <div className="w-full h-full flex items-center justify-center flex-col">
                                            <p className="my-4 mx-2 text-lg font-semibold">Aucun produit dans le panier</p>
                                            <Link href={"/"} className="btn text-white">Retour</Link>
                                        </div>
                                        :
                                        cartData?.map((item: Data) => {
                                            return <CartCard key={item?._id}
                                                productID={item?.productID}
                                                userID={item?.userID}
                                                _id={item?._id}
                                                quantity={item?.quantity}
                                                isOverlay={false}
                                            />
                                        })
                                }
                            </div>
                            <div className="w-full  py-2 my-2 flex justify-end -mt-3 relative">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Original Price  <span className="text-xl font-extrabold">&euro; {totalPrice || 0}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Shipping Price  <span className="text-xl font-extrabold">&euro; {5}</span> </h1>
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  tax Price  <span className="text-xl font-extrabold">&euro; {0}</span> </h1>
                            </div>
                            <div className="w-full py-2 my-2 flex justify-end -mt-5 relative">
                                <h1 className="py-2 tracking-widest mb-2 border-b px-6 border-orange-600 text-sm flex flex-col">  Total Order Price  <span className="text-xl font-extrabold">&euro; {totalPrice + 5}</span> </h1>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="md:w-1/2 px-2 w-full max-w-lg py-2 flex-col -mt-8 relative">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label >
                                <input {...register("fullName", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.fullName && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Your Address</span>
                                </label>
                                <input  {...register("address", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.address && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input  {...register("city", { required: true })} type="text" className="file-input file-input-bordered w-full " />
                                {errors.city && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text">Postal Code</span>
                                </label>
                                <input  {...register("postalCode", { required: true })} type="number" className="file-input file-input-bordered w-full " />
                                {errors.postalCode &&  <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control w-full ">
                                <label className="label">
                                    <span className="label-text">Country</span>
                                </label>
                                <select {...register("country", { required: true })} className="select select-bordered w-full ">
                                    <option value="">Select a country</option>
                                    {countries.map((country) => (
                                    <option key={country.iso2} value={country.iso2}>
                                        {country.flag} {country.name}
                                    </option>
                                    ))}
                                </select>
                                {errors.country && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>

                            <button className="btn btn-block mt-12 relative">Commander !</button>
                            {showPaypal && orderId && (
                                <PayPalButtons
                                    createOrder={
                                        async () => {
                                            try 
                                            {
                                            //console.log("Order ID:", orderId);
                                            const res =  await create_a_new_paypal_order({ orderData: { amount: totalPrice, orderId : orderId } });
                                            //console.log("PayPal Order Creation Response:", res);

                                            if (!res.id) {
                                                const errorData = await res.json();
                                                console.error('Server error:', errorData);
                                                throw new Error('Failed to create PayPal order');
                                            }

                                            console.log("Created PayPal Order ID:", res?.id);
                                            //console.log("Order ID 2:", res?.orderData);
                                            //ici je mets à jour la commande avec update PUT de la commande en ajoutant l'orderID paypal pour fetch pendant le onapprove
                                            const ord =  await update_an_order( {orderId: orderId }, {paypalOrderId: res?.id }, {isPaid: false } );

                                            return res?.id;

                                            }
                                            catch (err) {
                                                console.error('CreateOrder error:', err);
                                                throw err;  // Let onError handle
                                            }
                                        }
                                    }

                                    onApprove={async (data, actions) => {
                                    //console.log("My OrderID in onApprove:", orderId);
                                    //console.log("whole data:", data);
                                    

                                    // Guard against undefined actions/order provided by the PayPal SDK
                                    if (!actions || !('order' in actions) || !actions.order || typeof actions.order.capture !== 'function') {
                                        console.error('PayPal actions.order is not available', actions);
                                        toast.error("Impossible de finaliser le paiement : actions PayPal non disponibles.", {
                                            toastId: 'paypal-actions-unavailable',
                                            autoClose: 5000,
                                            position: 'bottom-center',
                                        });
                                        return;
                                    }

                                    try {
                                        //const details = await actions.order.capture();
                                        
                                        // 2. Then send to your backend to verify and update
                                        const res = await fetch('/api/paypal/create-paypal-order', {
                                        method: 'PUT',
                                        headers: { 
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${Cookies.get('token')}` // Include auth
                                        },
                                        body: JSON.stringify({ 
                                            orderId: data.orderID, 
                                            payerID: data.payerID, // Important for backend capture
                                            myOrderId: orderId 
                                        }),
                                        });
                                        
                                        const result = await res.json();

                                        console.log('Payment verification result:', result);
                                        
                                        if (result.success) {

                                            //ici je récupère l'orderID paypal et je mets à jour la commande avec l'orderID correspondant
                                            const res =  await update_an_order( {orderId: orderId }, {paypalOrderId: data.orderID }, {isPaid: true });

                                            // Payment completed successfully
                                            console.log('Payment completed!');
                                            toast("Paiement Validé :)", {
                                                toastId: 'payment-success',
                                                autoClose: 5000, 
                                                position: 'bottom-center',
                                                className: 'custom-warning-shadow toast-message'
                                            })
                                            setTimeout(() => {
                                                Router.push('/')
                                            } , 4000)
                                        }
                                        else{
                                        toast.error("Le paiement a échoué. Veuillez réessayer.", {
                                            toastId: 'payment-error6',
                                            autoClose: 5000, 
                                            position: 'bottom-center',
                                            className: 'custom-warning-shadow toast-message'
                                        })
                                        }
                                    } catch (err) {
                                        console.error('onApprove error:', err);
                                        toast.error("Une erreur est survenue lors de la finalisation du paiement.", {
                                            toastId: 'paypal-approve-error',
                                            autoClose: 5000,
                                            position: 'bottom-center'
                                        });
                                    }
                                    }}
                                    onError={(err) => {
                                        toast.error("Un problème est survenu lors du paiement. Le paiement est refusé.", {
                                            toastId: 'bookmark-error6',
                                            autoClose: 5000, 
                                            position: 'bottom-center',
                                            className: 'custom-warning-shadow toast-message'
                                        })
                                    }}
                                    style={{ layout: 'vertical' }}
                                />
                            )}
                        </form >

                    </div >


                )
            }

        </div>
        <Footer />
        <ToastContainer/>
        </>
    )
}

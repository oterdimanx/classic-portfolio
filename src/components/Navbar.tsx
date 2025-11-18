"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { RootState } from '@/Store/store';
import { useSelector } from 'react-redux';
import { FaCartArrowDown } from 'react-icons/fa';
import { CiDeliveryTruck } from 'react-icons/ci'
import { MdFavorite } from 'react-icons/md';
import CartOverlay from './CartOverlay';

interface NavbarProps {
    isHomePage?: boolean;
}

export default function Navbar( {isHomePage = false} : NavbarProps ) {
    const router = useRouter()
    const pathname = usePathname()
    const isCartPage = pathname.includes('/order/create-order')
    const [Scrolled, setScrolled] = useState(false)
    const [isCartOpened, setIsCartOpened] = useState(false)
    const [isExiting, setIsExiting] = useState(false)
    const user =  useSelector((state : RootState) => state.User.userData)

    useEffect(() => {
        window.onscroll = () => {
            setScrolled(window.pageYOffset < 30 ? false : true)
            return () => window.onscroll = null
        }
    }, [Scrolled])

    const handleLogout = () => {
        Cookies.remove('token')
        localStorage.clear()
        location.reload()
    }

    const handleCheckout = () => {
        setIsExiting(true)
        setTimeout(() => {
            setIsCartOpened(false)
            router.push('/order/create-order')
            setIsExiting(false)
        },2000)
    }

    // Close Basket on Escape key
    useEffect(() => {
        const handleEsc = (event: { key: string; }) => {
        if (event.key === 'Escape') {
            setIsCartOpened(false);
        }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div className={`navbar ${!Scrolled && isHomePage ? "" : "bg-white/95"} mainNav top-0 left-0 pb-0 pt-0 ${isHomePage ? "fixed z-10" : "border-b-2 border-b-red-900"} `}>
            <div className={`flex-none block ${!isHomePage ? "border-r-2 border-r-red-900 h-[130px] top-menu-image-container" : "h-[130px]"}`}>
                <div className="dropdown">
                    <label className="text-white">
                    {
                        isHomePage ? 
                        <img src={'/turtle-transparent.png'} alt="turtle.png" width="250" height="150" className="md:block" onClick={() => router.push("/")} /> :
                        <img src={'/turtle.png'} alt="turtle.png" width="250" height="250" className="md:block" onClick={() => router.push("/")} />
                    }
                    </label>
                </div>
            </div>
            <div className={`secondaryNav bg-white-50 ${!isHomePage ? "px-0 relative -tracking-[0.06em] -left-[2px] -top-[0px]" : "px-0 relative -tracking-[0.06em] -left-[2px] -top-[0px]"}`}>
                <ul className="secondaryNavHeader">
                    <li>
                        <div className="text-sm m-w-full overflow-x-auto">
                            <ul className={`dark:text-black text-xl flex subpixel-antialiased ${!isHomePage ? " text-red-400" : Scrolled ?  " text-black" :  " text-white"}`}> 
                                <li className="pl-10 whitespace-nowrap">
                                    <Link className={isHomePage ? Scrolled ?  " btn text-black mx-2 bg-transparent hover:text-white" :  " btn text-white mx-2 bg-transparent" : "btn text-white mx-2"} href={"/PortFolio-All-Images"}>Voir toutes les images</Link>
                                </li>                                
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="navbar-end m-auto">
                <div className="flex-none">
                    {
                        user ?
                        <div className="flex items-center justify-center -top-[0px] relative">
                         <button onClick={handleLogout} className={isHomePage ? Scrolled ?  " btn text-black mx-2 bg-transparent hover:text-white" :  " btn text-white mx-2 bg-transparent" : "btn text-white mx-2"} aria-label="Logout">logout</button>
                         <button onClick={()=> {!isCartOpened && !isCartPage && setIsCartOpened(true)}} 
                         className={
                            isHomePage ? 
                            Scrolled ? "focus:outline-none btn btn-circle mx-2 bg-black" : "focus:outline-none btn btn-circle mx-2 bg-transparent" 
                            : 
                            isCartPage ? "focus:outline-none btn btn-circle mx-2 opacity-50 cursor-not-allowed" : "focus:outline-none btn btn-circle mx-2"
                        } 
                         aria-label="View Basket"
                         disabled={isCartPage}
                         >
                            <FaCartArrowDown className="text-white text-xl" />
                         </button>
                         <button onClick={() => router.push("/bookmark")} 
                         className={
                            isHomePage ? 
                            Scrolled ? "btn btn-circle mx-2 bg-black" : "btn btn-circle mx-2 bg-transparent" 
                            : "btn btn-circle mx-2"} aria-label="View My Bookmarks"><MdFavorite className="text-white text-xl" /></button>
                         <button onClick={() => router.push("/order/view-orders")} 
                         className={
                            isHomePage ? 
                            Scrolled ? "btn btn-circle mx-2 bg-black" : "btn btn-circle mx-2 bg-transparent" 
                            : "btn btn-circle mx-2"} aria-label="View My Orders"><CiDeliveryTruck className="text-white text-xl" /></button>
                         
                        </div>
                            :
                            <button onClick={() => router.push('/auth/login')} className="btn text-white mx-2 btn-login relative" aria-label="Login">Login</button>
                    }
                    {/* Overlay Panel */}
                    {isCartOpened && (
                        <>
                        <div
                            onClick={() => setIsCartOpened(false)}
                            className="fixed inset-0 z-40 backdrop-blur-sm animate-fadeIn"
                        />

                        {/* Slide-in panel from the right */}
                        <div className={`fixed top-0 right-0 h-full bg-white z-50 animate-slideFromRight shadow-lg sm:w-[450px]
                        ${isExiting ? 'animate-slideOutToRight' : 'animate-slideFromRight'}`}>
                            <div className="p-6 flex justify-between items-center border-b">
                                <h2 className="text-xl font-semibold">Votre Panier</h2>
                                <button className="text-xl font-semibold" onClick={() => setIsCartOpened(false)}>✕</button>
                            </div>

                            <div className="p-6">
                                <CartOverlay isOpened={isCartOpened} onClose={() => setIsCartOpened(false)} />
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                            >
                                Checkout
                            </button>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    )
}

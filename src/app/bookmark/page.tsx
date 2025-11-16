"use client"

import { get_all_bookmark_items } from '@/Services/common/bookmark'
import { RootState } from '@/Store/store'
import FavouriteProductDataTable from '@/components/FavouriteProductDataTable'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import { setNavActive } from '@/utils/AdminNavSlice'
import { setBookmark } from '@/utils/Bookmark'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}

export default function Page() {
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as userData | null
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!Cookies.get('token') || user === null) {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Router])

    useEffect(() => {
        fetchBookmarkData();
    }, [])

    const fetchBookmarkData = async () => {
        if (!user?._id) return Router.push('/')
        const bookmarkData = await get_all_bookmark_items(user?._id)
        if (bookmarkData?.success) {
            dispatch(setBookmark(bookmarkData?.data))
        } else {

            if (undefined !== Cookies.get('token') && 'login' == bookmarkData?.message) {
                Cookies.remove('token');
                localStorage.clear();
                return Router.push('/auth/login?token=expired')
            }

        }
        setLoading(false)
    }

    return (
        <>
        <div>
          <Navbar />
        </div>
        <div className="w-full bg-gray-50 h-screen px-3 py-2 font-[Poppin]">
            <div className="text-sm breadcrumbs ">
                <ul className="dark:text-black">
                    <li>
                        <MdFavorite className="w-4 h-4 mr-2 stroke-current" />
                        Gérez ici vos images favorites
                    </li>
                </ul>
            </div>
            <div className="w-full h-5/6 py-5">
                <FavouriteProductDataTable />
            </div>
        </div>
        <Footer />
        </>
    )
}
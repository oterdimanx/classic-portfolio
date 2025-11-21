'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { get_product_by_slug } from '@/Services/Admin/product'
import Loading from '@/app/loading'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'

import Navbar from '@/components/Navbar'
import ProductDetails from '@/components/ProductDetails'
import Footer from '@/components/Footer'

type ProductData = {
    _id: string,
    productName: string,
    productDescription: string | undefined,
    productImage: string,
    productSlug: string,
    productPrice: number,
    productQuantity: number,
    productFeatured: boolean,
    productCategory: {
        categoryName: string,
        _id: string,
    },
    createdAt: string;
    updatedAt: string;
};

export default function Page() {
    const dispatch = useDispatch();
    const [prodData, setprodData] = useState<ProductData | undefined>(undefined);
    const useParamObject = useParams<{ slug: string }>()
    const slug  = useParamObject.slug;
    const { data, isLoading } = useSWR('/gettingProductbySlug', () => get_product_by_slug(slug))

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        dispatch(setUserData(JSON.parse(userData)));
    }, [])

    useEffect(() => {
        setprodData(data?.data)
    }, [data])

    return (
        <>
        <div>
          <Navbar />
        </div>
        <div className="w-full h-full dark:text-black lg:h-4/5 bg-white py-4 px-2">

            <div className="lg:h-4/5 py-4 px-4 flex items-center justify-center">
                {
                    isLoading ?
                    <div className="w-4/5 bg-gray-100 rounded-xl h-4/5 flex items-center justify-center shadow-2xl">
                        <Loading />
                    </div>
                    :
                    <><ProductDetails product={{
                            title: prodData?.productName || "Loading Product Name",
                            description: prodData?.productDescription || "Loading Product Description",
                            images: [
                                prodData?.productImage || '/ryu.gif'
                            ],
                            price: prodData?.productPrice || 0,
                            inStock: prodData?.productQuantity ?? prodData?.productQuantity === 0 ? true : false,
                            isFeatured: prodData?.productFeatured ? true : false,
                            sizeGuideUrl: "/xxx.png",
                            _id: prodData?._id || 'unk_zyy'
                        }} />
                    </>
                }
            </div>
        </div>
        <Footer />
        </>
    )
}

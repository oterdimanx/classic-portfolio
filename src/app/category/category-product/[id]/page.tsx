"use client"

import { get_product_by_category_id } from '@/Services/Admin/product'
import Loading from '@/app/loading'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'

interface pageParam {
    id: string
}

type ProductData = {
    productQuantity: number
    productName: string,
    productImage: string,
    productSlug: string,
    productPrice: number,
    productFeatured: boolean,
    productCategory : {
        categoryName : string,
        categoryDescription  :string ,
        _id : string,
    },
    _id : string
};

export default function Page() {

    const [thisProduct , setThisProdData] =  useState<ProductData[] | []>([]);
    const useParamObject = useParams<{ id: string }>()
    const  id  = useParamObject.id;
    const { data, isLoading } = useSWR('/gettingProductOFSpecificCategoryID', () => get_product_by_category_id(id))
    //if (data?.success !== true) throw new Error (data?.message)

    useEffect(() => {
        setThisProdData(data?.data)
    }, [data])

    const CategoryName  =  thisProduct?.map((item) => {
        return item?.productCategory?.categoryName
    })

    return (
        <>
        <div>
          <Navbar />
        </div>
        <div className="dark:text-black w-full h-full bg-white px-2 font-[Poppin]">

            <div className="w-full h-5/6 flex items-start justify-center flex-wrap overflow-auto">
                {
                    isLoading ? <Loading /> : <>
                         {
                                thisProduct?.map((item: ProductData) => {
                                    return <ProductCard
                                        productName={item?.productName}
                                        productPrice={item?.productPrice}
                                        productFeatured={item?.productFeatured}
                                        productImage={item?.productImage}
                                        productSlug={item?.productSlug}
                                        productCategory={item?.productCategory}
                                        _id={item?._id}
                                        key={item?._id} 
                                        productQuantity={item?.productQuantity} 
                                        />
                                })
                            }
                    </>
                }
                {
                    isLoading === false && thisProduct ===  undefined || thisProduct?.length <  1 && <p className="text-2xl my-4 text-center font-semibold text-red-400">No Product Found in this Category</p>
                }
            </div>

            <Footer />
        </div>
        </>
    )
}

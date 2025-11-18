"use client"

import React, { useState , useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '../loading'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'
import { RootState } from '@/Store/store'
import LeftColSelectedProducts from '@/components/LeftColSelectedProducts'
import Link from 'next/link'
import { get_all_products } from '@/Services/Admin/product'
import { setCategoryData, setCatLoading, setProdLoading, setProductData } from '@/utils/AdminSlice'
import { get_all_categories } from '@/Services/Admin/category'

type ProductData = {
    productName: string,
    productImage: string,
    productSlug: string,
    productPrice: Number,
    productQuantity: Number,
    productFeatured: Boolean,
    productCategory : {
        categoryName : string,
        categoryDescription  :string ,
        _id : string,
    },
    _id : string
};

export default function Shop() {

  const dispatch = useDispatch();
  const [categoryId,SetCategoryId] = useState('all')
  const categoryLoading = useSelector((state: RootState) => state.Admin.catLoading)
  const productLoading = useSelector((state: RootState) => state.Admin.productLoading)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    dispatch(setUserData(JSON.parse(userData)));
  }, [])

  const catData = useSelector((state: RootState) => state.Admin.category)
  var ii = 0

  useEffect(() => {
    FetchDataOFProductAndCategory()
  }, [])

  const FetchDataOFProductAndCategory = async () => {

    const categoryData = await get_all_categories();
    if (categoryData?.success !== true) throw new Error (categoryData?.message)

    dispatch(setCategoryData(categoryData?.data))

    const productData = await get_all_products();
    if (productData?.success !== true) throw new Error (productData?.message)

    dispatch(setProductData(productData?.data))

    setLoading(false)
  }

  useEffect(() => {
    dispatch(setCatLoading(loading))
    dispatch(setProdLoading(loading))
  }, [categoryLoading, productLoading, dispatch, loading])
  
  return (
    <>
      <div>
        <Navbar />
      </div>
      {
        categoryLoading ? <Loading /> :
          <>
            <div className="flex h-full bg-white/95 text-black">
            <div className="border-r-2 border-r-red-900 flex-initial w-[252px]">
              <p className="mt-3 pt-8 pb-1 pl-9 pr-8 flex-initial text-xl uppercase">Categories</p>
              <ul className="pl-9">
                <li className="rounded-lg cursor-pointer pt-2 w-[80%] relative li-carrousel-element">
                      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                      <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                        <Link href={"/PortFolio-All-Images"} onClick={()=>SetCategoryId('all')}>ALL</Link>
                      </span>
                  </li>
                {
                    <>
                        {
                            catData?.length < 1 ? <h1 className="text-2xl font-semibold text-white bg-black text-white px-6 py-3 rounded-lg shadow-md border border-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">No Categories</h1> :
                            catData?.map((item) => {
                                return <li className="rounded-lg cursor-pointer pt-2 w-[80%] relative" key={'li-' + ii++}>
                                    <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                                    <span className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                                      <Link 
                                        href={"/PortFolio-All-Images"}
                                        onClick={()=>{
                                            SetCategoryId(item?._id)
                                        }}
                                        key={ii++}
                                    >{item?.categoryName}</Link>
                                  </span>
                                </li>
                            })
                        }
                    </>
                }
              </ul>
            </div>
            <div className="flex-1">
                <LeftColSelectedProducts categoryId={categoryId} />
            </div>
            </div>

            <Footer />
          </>
      }

    </>
  )
}
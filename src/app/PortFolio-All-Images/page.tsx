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
import router from 'next/router'

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
  const columnStyles = {
      primary: "border-r-2 border-r-red-900 flex-initial w-[252px]",
      none: "flex-initial w-[110px]",
  }
  const buttonStyles = {
      primary: "bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md",
      secondaryGray: "btn font-semibold mt-2 border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-200",
      secondaryGreen: "btn mx-2 border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg font-large hover:bg-green-50 transition-all duration-200 w-full",
  }

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
            <div className={columnStyles.none}>
              <ul className="pl-2 pt-6">
                {
                    <>
                        {
                          catData?.length < 1 ? <h1 className="text-2xl font-semibold text-white bg-black text-white px-6 py-3 rounded-lg shadow-md border border-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer">No Categories</h1> :
                          catData?.map((item) => {
                              return <li className="rounded-lg cursor-pointer pt-2 w-[80%] relative" key={'li-' + ii++}>
                                      <button className={buttonStyles.secondaryGreen}>
                                        <Link 
                                          href={"/PortFolio-All-Images"}
                                          onClick={()=>{
                                              SetCategoryId(item?._id)
                                          }}
                                          key={ii++}
                                      >{item?.categoryName}</Link>
                                      </button>
                                    </li>
                          })
                        }
                        <button className={buttonStyles.secondaryGray}>
                          <Link href={"/Skateboarding-Is-Not-A-Crime"}>Skate</Link>
                        </button>
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
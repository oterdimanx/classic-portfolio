"use client"

import React, { useState, useEffect } from 'react'
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
    productCategory: {
        categoryName: string,
        categoryDescription: string,
        _id: string,
    },
    _id: string
};

export default function Shop() {
    const dispatch = useDispatch();
    const [categoryId, SetCategoryId] = useState('all');
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const categoryLoading = useSelector((state: RootState) => state.Admin.catLoading);
    const productLoading = useSelector((state: RootState) => state.Admin.productLoading);
    const [loading, setLoading] = useState(true);

    const buttonStyles = {
        primary: "bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md text-sm",
        secondaryGray: "btn font-semibold mt-2 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-all duration-200 text-sm",
        secondaryGreen: "btn mx-1 border border-gray-300 bg-white text-gray-700 px-2 py-1.5 rounded-lg hover:bg-green-50 transition-all duration-200 w-full text-xs",
    };

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        dispatch(setUserData(JSON.parse(userData)));
    }, []);

    const catData = useSelector((state: RootState) => state.Admin.category);
    var ii = 0;

    useEffect(() => {
        FetchDataOFProductAndCategory();
    }, []);

    const FetchDataOFProductAndCategory = async () => {
        const categoryData = await get_all_categories();
        if (categoryData?.success !== true) throw new Error(categoryData?.message);

        dispatch(setCategoryData(categoryData?.data));

        const productData = await get_all_products();
        if (productData?.success !== true) throw new Error(productData?.message);

        dispatch(setProductData(productData?.data));

        setLoading(false);
    };

    useEffect(() => {
        dispatch(setCatLoading(loading));
        dispatch(setProdLoading(loading));
    }, [categoryLoading, productLoading, dispatch, loading]);

    const handleCategoryClick = (categoryId: string) => {
        SetCategoryId(categoryId);
        // Auto-close accordion on mobile after selection
        if (window.innerWidth < 768) {
            setIsAccordionOpen(false);
        }
    };

    return (
        <>
            <div>
                <Navbar />
            </div>
            {categoryLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex flex-col md:flex-row h-full bg-white text-black">
                        {/* Mobile Accordion Header */}
                        <div className="md:hidden border-b border-gray-200 bg-white">
                            <button
                                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                className="w-full px-4 py-3 flex items-center justify-between text-base font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <span>Categories</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Categories Sidebar - Hidden on mobile when collapsed */}
                        <div className={`
                            ${isAccordionOpen ? 'block' : 'hidden'} 
                            md:block 
                            bg-white border-r border-gray-200 
                            md:w-48 lg:w-56 
                            transition-all duration-300
                            overflow-hidden
                        `}>
                            <div className="p-3 md:p-4">
                                {/* All Categories Button
                                <button
                                    className={`${buttonStyles.secondaryGreen} mb-3 ${categoryId === 'all' ? 'bg-green-100 border-green-400' : ''}`}
                                    onClick={() => handleCategoryClick('all')}
                                >
                                    All Products
                                </button>
                                */}
                                {/* Categories List */}
                                <div className="max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
                                    <ul className="space-y-1">
                                        {catData?.length < 1 ? (
                                            <li className="text-center py-3 text-gray-500 text-sm">
                                                No Categories Available
                                            </li>
                                        ) : (
                                            catData?.map((item) => (
                                                <li key={item?._id}>
                                                    <button
                                                        className={`${buttonStyles.secondaryGreen} ${
                                                            categoryId === item?._id 
                                                                ? 'bg-green-100 border-green-400 text-green-800' 
                                                                : ''
                                                        }`}
                                                        onClick={() => handleCategoryClick(item?._id)}
                                                    >
                                                        {item?.categoryName}
                                                    </button>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>

                                {/* Hardcoded Skate Button */}
                                <button className={`${buttonStyles.secondaryGray} w-full mt-3 text-xs md:text-sm`}>
                                    <Link 
                                        href="/Skateboarding-Is-Not-A-Crime"
                                        className="block w-full text-center"
                                    >
                                        Skate
                                    </Link>
                                </button>
                            </div>
                        </div>

                        {/* Products Section - Takes full width on mobile when accordion is closed */}
                        <div className={`
                            flex-1 
                            transition-all duration-300
                            ${isAccordionOpen ? 'h-0 md:h-auto' : 'h-full'}
                        `}>
                            <LeftColSelectedProducts categoryId={categoryId} />
                        </div>
                    </div>

                    <Footer />
                </>
            )}
        </>
    );
}
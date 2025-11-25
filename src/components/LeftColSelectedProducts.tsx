"use client"

import Loading from '@/app/loading'
import ProductCard from '@/components/ProductCard'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store/store'

type ProductData = {
    productName: string,
    productImage: string,
    productSlug: string,
    productPrice: number,
    productQuantity: number,
    productFeatured: Boolean,
    productCategory: {
        categoryName: string,
        categoryDescription: string,
        _id: string,
    },
    _id: string
};

export default function LeftColSelectedProducts(props: any) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentProducts, setCurrentProducts] = useState<any[]>([]);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const isFirstRender = useRef(true);
    const containerRef = useRef<HTMLDivElement>(null);
    //const [opacity, setOpacity] = useState(1);
    const prodData = useSelector((state: RootState) => state.Admin.product);
    const prodLoading = useSelector((state: RootState) => state.Admin.productLoading);

    const filteredProducts = useMemo(() => {
        const CategoryProducts = prodData?.filter((prod: ProductData) => {
            if (props.categoryId != 'all') {
                return prod?.productCategory?._id == props.categoryId;
            }
            return prod;
        });
        return CategoryProducts?.slice(0, 50) || [];
    }, [prodData, props.categoryId]);
/*
    useEffect(() => {
        if (filteredProducts.length > 0 && JSON.stringify(currentProducts) !== JSON.stringify(filteredProducts)) {
            // Fade out
            setOpacity(0.3);
            
            // Start flip after fade starts
            const flipTimer = setTimeout(() => {
                setIsFlipped(true);
                
                // Update products mid-flip
                const updateTimer = setTimeout(() => {
                    setCurrentProducts(filteredProducts);
                    setIsFlipped(false);
                    
                    // Fade in after flip completes
                    const fadeInTimer = setTimeout(() => {
                        setOpacity(1);
                    }, 200);
                    
                    return () => clearTimeout(fadeInTimer);
                }, 350); // Mid-flip timing
                
                return () => clearTimeout(updateTimer);
            }, 150); // Initial delay
            
            return () => clearTimeout(flipTimer);
        } else {
            setCurrentProducts(filteredProducts);
        }
    }, [filteredProducts]);
*/
    useEffect(() => {
        if (isFirstRender.current) {
            setCurrentProducts(filteredProducts);
            isFirstRender.current = false;
            setTimeout(() => setShouldAnimate(true), 100);
            return;
        }

        if (shouldAnimate && filteredProducts.length > 0 && JSON.stringify(currentProducts) !== JSON.stringify(filteredProducts)) {
            setIsFlipped(true);
            
            const updateTimer = setTimeout(() => {
                setCurrentProducts(filteredProducts);
                setIsFlipped(false);
            }, 200); // Mid-flip timing
            
            return () => clearTimeout(updateTimer);
        } else {
            setCurrentProducts(filteredProducts);
        }

    }, [filteredProducts, shouldAnimate]);
    var ii = 0;

    return (
        <div 
            ref={containerRef}
            className="w-full h-full bg-gray-50 py-4 px-2 font-[Poppin] overflow-auto" // Added overflow-auto here
            style={{ 
                WebkitOverflowScrolling: 'touch', // Better scrolling on iOS/Chrome
                transform: 'translateZ(0)' // Force hardware acceleration
            }}
        >
            <div className={`w-full h-full perspective-1200 ${isFlipped ? 'pointer-events-none' : ''}`}>
                <div className={`relative w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front Side */}
                    <div className="w-full h-full backface-hidden">
                        <div className="w-full h-full flex items-start justify-center flex-wrap">
                            {prodLoading ? (
                                <div className="w-full h-96"><Loading /></div>
                            ) : (
                                currentProducts?.map((item: ProductData) => (
                                    <ProductCard
                                        productName={item?.productName}
                                        productPrice={item?.productPrice}
                                        productFeatured={item?.productFeatured}
                                        productImage={item?.productImage}
                                        productSlug={item?.productSlug}
                                        productQuantity={item?.productQuantity}
                                        productCategory={item?.productCategory}
                                        _id={item?._id}
                                        key={item?._id + ii++}
                                    />
                                ))
                            )}
                            {currentProducts?.length === 0 && !prodLoading && (
                                <p className="text-2xl my-4 text-center font-semibold text-red-400">
                                    No Product Found in this Category
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full backface-hidden rotate-y-180 flex items-center justify-center bg-white/90">
                        <div className="text-center animate-pulse">
                            <div className="text-3xl mb-2">✨</div>
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .perspective-1200 { 
                    perspective: 1200px; 
                }
                .transform-style-preserve-3d { 
                    transform-style: preserve-3d; 
                }
                .backface-hidden { 
                    backface-visibility: hidden; 
                }
                .rotate-y-180 { 
                    transform: rotateY(180deg); 
                }
                .transition-transform {
                    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                /* Force smooth scrolling in Chrome */
                .overflow-auto {
                    -webkit-overflow-scrolling: touch;
                    overflow-anchor: none;
                }
            `}</style>
        </div>
    );
}
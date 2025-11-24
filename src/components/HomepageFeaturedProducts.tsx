"use client"

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import Loading from '@/app/loading'
import Dot from '@/components/Dot'

type ProductData = {
    productName: string,
    productSlug: string,
    productFeatured: Boolean,
    _id: string
};

export default function HomepageFeaturedProducts() {
    const [animationStage, setAnimationStage] = useState(0); // 0: start, 1: final positions, 2: curved positions
    const prodData = useSelector((state: RootState) => state.Admin.product);
    const prodLoading = useSelector((state: RootState) => state.Admin.productLoading);
    
    const FeaturedProducts = prodData?.filter((prod: ProductData) => {
        if(prod?.productFeatured){
            return prod
        }
    })

    const filteredProducts = FeaturedProducts?.slice(0, 11)
    
    // Stage 1: Final positions (straight line)
    const finalCoords = [
        [60,20], [60,30], [60,40], [60,50], [60,60], 
        [20,35], [20,50], [60,90], [60,10], [60,5], [60,75]
    ];

    // Stage 2: Curved positions - modify these to create your desired curve
    const curvedCoords = [
        [30,35], [32,37], [34,39], [35,41], [35,43], [34,45],  // Curving left
        [20,37], [20,47], [33,47], [31,49], [27,42] // Adjust as needed
    ];

    useEffect(() => {
        // Stage 1: Move from left to final positions
        const stage1Timer = setTimeout(() => {
            setAnimationStage(1);
        }, 100);

        // Stage 2: Bend into curve after a delay
        const stage2Timer = setTimeout(() => {
            setAnimationStage(2);
        }, 500); // Wait 1.5 seconds after stage 1 completes

        return () => {
            clearTimeout(stage1Timer);
            clearTimeout(stage2Timer);
        };
    }, []);

    const getCurrentCoords = (index: number) => {
        switch(animationStage) {
            case 0: // Start - off screen left
                return [finalCoords[index][0], -10];
            case 1: // Final positions (straight line)
                return finalCoords[index];
            case 2: // Curved positions
                return curvedCoords[index];
            default:
                return finalCoords[index];
        }
    };

    var i = -1

    return (
        prodLoading ? <Loading /> :
            <>
                {
                    filteredProducts?.length < 1 ? 
                    console.log('Featured Products Could not be retrieved')
                    :
                    filteredProducts?.map((item: ProductData, index: number) => {
                        i++
                        const [top, left] = getCurrentCoords(i);
                        return (
                            <Dot
                                top={top}
                                left={left}
                                _id={item?._id}
                                label={item?.productName}
                                _slug={item?.productSlug}
                                key={item?._id}
                                animationStage={animationStage}
                                index={index}
                            />
                        )
                    })
                }
            </>
    )
}
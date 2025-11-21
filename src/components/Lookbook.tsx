import React, { useEffect, useState } from 'react'
import { RootState } from '@/Store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setLookbookData, setLookbookLoading } from '@/utils/AdminSlice'
import Loading from '@/app/loading';
import { get_all_lookbooks } from '@/Services/Admin/lookbook';
import ImageMarquee from './ImageMarquee';
import Link from 'next/link';

/*
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/Firebase'
*/

export default function Lookbook() {

    //const [storedImages, setStoredImages] = useState([])
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [filteredDatas, setFilteredDatas] = useState([])
    const lookbookData = useSelector((state: RootState) => state.Admin.lookbook)
    const lookbookLoading = useSelector((state: RootState) => state.Admin.lookbookLoading)
    var ii2 = 0
    var urls = []
    var kii = 'lbook-';

    useEffect(() => {
        FetchDataOFLookbook()
      }, [])

    const FetchDataOFLookbook = async () => {
        const lookbookData = await get_all_lookbooks();
        if (lookbookData?.success !== true) throw new Error (lookbookData?.message)
        setFilteredDatas(lookbookData?.data)
        dispatch(setLookbookData(lookbookData?.data))
        setLoading(false)
      }
    
      useEffect(() => {
        dispatch(setLookbookLoading(loading))
      }, [lookbookLoading, dispatch, loading])

/*
    const renderedValues = []

    useEffect(() => {
        getStoredImages()
      }, [])

    const getStoredImages = async () => {
        const listRef = ref(storage,'lookbook')
        var lookBook:any = []
        var ii = 0
        listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef).then((downloadURL) => {
                    if(!lookBook.includes(downloadURL)){
                        lookBook[ii] = downloadURL
                        ii++;
                        setStoredImages(lookBook)
                    }
                }).catch((error) => {
                    console.log(error)
                    lookBook = []
                    return lookBook
                });
            })
        })
        return lookBook
    }
*/

    for (var link of filteredDatas) {
        urls.push(Object(link).lookbookImageUrls.split(';'))
    }

    urls = urls[0]?.filter((elem: string) => '' !== elem)

    return (  
                        <div className="grid container">
                        <div>
                            <div className="lookbook-container">
                                <div key="leftcol-lbook"></div>
                                <div className="relative w-full h-[calc(100vh-60px)] overflow-y-hidden">
                                    {
                                        lookbookLoading ? <div className="w-full h-96"><Loading /> </div> :
                                        <>

                                            {
                                                lookbookData?.length < 1 ? 
                                                    <section className="relative h-screen w-full">
                                                    {/* Video Background */}
                                                    <div className="absolute inset-0 w-full h-full">
                                                        <video
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        className="w-full h-full object-cover"
                                                        poster="/ryu.gif" // Optional: loading image
                                                        >
                                                        <source src="/rouk1-fakie-tre-sw-wheeling-sw-pop-out.mp4" type="video/mp4" />
                                                        <source src="/hero-background.webm" type="video/webm" /> {/* Better compression */}
                                                        </video>
                                                        {/* Optional overlay for better text readability */}
                                                        <div className="absolute inset-0 bg-black/30"></div>
                                                    </div>
                                                    
                                                    {/* Content */}
                                                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                                                        <h1 className="text-5xl md:text-7xl font-bold mb-4">Bienvenue ! Pas encore de vidéos pour le moment</h1>
                                                        <p className="text-xl md:text-2xl mb-8">skateboarding is not a crime</p>
                                                        <button className="btn mx-2 border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-200 font-semibold transition-colors">
                                                            <Link href={"/"}>Home</Link>
                                                        </button>
                                                    </div>
                                                    </section>
                                                :
                                                <ImageMarquee urls={urls} />
                                            }
                                        </>
                                    }
                                </div>
                                <div className="" key="rightcol-lbook"></div>
                            </div>
                        </div>
                    </div>

    )
}
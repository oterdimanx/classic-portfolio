"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { setUserData } from '@/utils/UserDataSlice'
import Lookbook from '@/components/Lookbook'
import Loading from '@/app/loading';

export default function Page() {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = localStorage.getItem('user');
        //if (!userData) return;
        if (userData) dispatch(setUserData(JSON.parse(userData)))
        setLoading(false)
      }, [])

    return (

        <>
          <Navbar />
          {
              <>
                <div className="bg-white px-2">
                    <div>
                        {
                            loading ? <Loading /> :
                            <>
                                <Lookbook />
                            </>
                        }
                    </div>
                </div>
                <Footer />
              </>
          }
        </>
    )

}
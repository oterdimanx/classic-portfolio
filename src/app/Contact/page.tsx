"use client"

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { setUserData } from '@/utils/UserDataSlice'
import Loading from '@/app/loading'
import Contact from '@/components/Contact'

export default function Page() {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [userData, setUserDataState] = useState<string | null>(null)

    useEffect(() => {
        const userDataFromStorage = localStorage.getItem('user')
        if (userDataFromStorage) {
            dispatch(setUserData(JSON.parse(userDataFromStorage)))
            setUserDataState(userDataFromStorage)
        }
        setLoading(false)
      }, [dispatch])

    return (
        <>
          <Navbar />
          {
              <>
                {
                    loading ? <Loading /> :
                    <>
                    <Contact />
                    </>
                }
                <Footer />
              </>
          }
        </>
    )
}
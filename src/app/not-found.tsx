"use client"

import React, { useState , useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from './loading'
import { useDispatch } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'
import { CharacterAnimation } from "@/components/CharacterAnimation";
import './styles/not-found.css'

export default function Custom404() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        dispatch(setUserData(JSON.parse(userData)));
        setLoading(false)
      }, [])

    return (
        <>
      <div className="grid">
        <Navbar />
      </div>
          {
            loading ? <Loading /> :
              <>
                <div className="w-full bg-gray-50 text-black flex items-center flex-col justify-start font-[Poppin]">
                  <div className="flex items-center justify-center px-2 py-2 mb-2">
                      <h1 className="py-2 px-4 border-x-2 border-x-orange-500 font-semibold text-2xl">La page à laquelle vous tentez d'accéder n'existe pas.</h1>
                  </div>

                  <div className="relative w-full max-w-4xl aspect-[3/2] mx-auto overflow-hidden rounded-2xl shadow-lg">
                    {/* Static first frame background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: "url('/politankz_first_frame.png')", // Make sure this file is in your public folder
                      }}
                    />

                    {/* Moving cloud layer (simulated with div) */}
                    <div className="absolute top-[10%] left-[-20%] w-[200%] h-[30%] bg-[url('/clouds_overlay.png')] bg-repeat-x opacity-30 animate-clouds" />

                    {/* Flickering light bulb */}
                    <div className="absolute top-[8.4%] left-[94%] w-4 h-4 bg-yellow-300 rounded-full blur-sm opacity-80 animate-flicker" />

                    {/* Flashing window light */}
                    <div className="absolute top-[21.2%] left-[33%] w-3 h-6 bg-yellow-200 opacity-90 animate-pulseLight rounded-sm" />
                  
                    <CharacterAnimation />
                  </div>

                </div>
                <Footer />
              </>
          }
        </>
      )
}
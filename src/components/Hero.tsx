import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Hero() {

  return (
      <div className="hero w-full flex-col md:hidden h-screen flex items-center px-3 justify-center text-center">
        <Image src={'/mob-intro.png'} alt="no image" sizes="50vw" fill />
{/** 
        <video preload="auto" width="1280" height="1024" controls={true} autoPlay={true}>
          <source src="/rouk1-fakie-tre-sw-wheeling-sw-pop-out.mp4" type="video/mp4"/>
        </video>
*/}
        <h1 className="mb-2 text-xl text-white/90 z-10 font-semibold">Welcome to my PortFolio!</h1>
        <Link href={"/Shop"} className="btn btn-ghost border border-orange-600 text-white/90 hover:bg-orange-600 z-40">Voir les images</Link>
      </div>
  )
}

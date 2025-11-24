import Link from 'next/link'
import React from 'react'

export default function Hero() {

  return (
      <div className="hero w-full flex-col md:hidden h-screen flex items-center px-3 justify-center text-center">
        <img src={'/mob-intro.png'} width="1024" height="1024" alt="mob-intro.png lurking futuristic donkey" />

        <h1 className="mb-2 text-xl text-white/90 z-10 font-semibold z-0">Welcome to my PortFolio!</h1>
        <Link href={"/PortFolio-All-Images"} className="btn btn-ghost border border-yellow-600 text-white/90 hover:bg-yellow-600 z-0">Voir les images</Link>
      </div>
  )
}

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
    return (
        <footer className="w-full text-center py-4 text-sm text-neutral-400 border-t border-neutral-700">
        <div className="relative inline">
          © {new Date().getFullYear()} Welcome to NanoMet's Backend Portfolio.
        </div>
        <div className="relative inline" onClick={() => router.push(`https://www.instagram.com/rouks.dome`)}>
          <button id="instagram" className=" border-2 hover:border-0 border-pink-500 bg-gradient-to-b text-2xl hover:from-indigo-600 hover:via-pink-600 hover:to-yellow-500 min-w-wull hover:text-white bg-white text-pink-600 w-12 h-12  transform hover:-translate-y-3 rounded-full duration-500 ">
            <FontAwesomeIcon icon={faInstagram} />
          </button>
        </div>
        <div className="relative inline">
          <div className="front relative bg-[gold] text-lime-500 text-[8vh] font-black font-serif">
            <div className="absolute top-0 left-0 w-full h-full animate-apptitle"
              style={{
                background: 'radial-gradient(circle, gold 40%, transparent 40%)',
                backgroundSize: '.5vh .5vh',
                backgroundPosition: '-.5vh',
              }} />
            <div className="absolute top-[50px] left-[10px] w-full h-full text-[gold] [text-shadow:-7px_0px_black,-1px_-1px_black,-5px_5px_black]">
              <div className="font-pixel">Portfolio</div>
              <div className="droplet absolute left-[64%] top-[77px] transform -translate-x-1/2 mt-2 w-2 h-2" />
            </div>
          </div>
        </div>
    </footer>
    )
}

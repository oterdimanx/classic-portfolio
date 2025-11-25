import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface MultiMarqueeProps {
  urls: string[];
}

const MultiMarquee = ({ urls }: MultiMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const totalHeight = useRef(0);
  const [isPageScrollAllowed, setIsPageScrollAllowed] = useState(false);

  const isVideoFile = (url: string): boolean => {
    if (!url) return false;
    const videoRegex = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv|3gp|m4v)(?:-[^?&#]*)?(?=[?&#]|$)/i;
    return videoRegex.test(url);
  };

  // Safe array access with default empty array
  const safeUrls = urls || [];
  
  // Find the first video in the array
  const firstVideoIndex = safeUrls.findIndex(url => isVideoFile(url));
  const hasVideo = firstVideoIndex !== -1;
  
  // If video exists, use it as special element, otherwise use first URL
  const specialElement = hasVideo ? safeUrls[firstVideoIndex] : safeUrls[0];
  const isSpecialElementVideo = hasVideo;
  
  // All URLs except the special element go in scrolling section
  const scrollElements = hasVideo 
    ? safeUrls.filter((url, index) => index !== firstVideoIndex)
    : safeUrls.slice(1);

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const scrollAmount = e.deltaY;

    setScrollY((prevScrollY) => {
      let newScrollY = prevScrollY + scrollAmount;
      newScrollY = Math.max(0, newScrollY);
      newScrollY = Math.min(newScrollY, totalHeight.current);

      if (newScrollY === totalHeight.current) {
        setIsPageScrollAllowed(true);
      } else {
        setIsPageScrollAllowed(false);
      }

      if (newScrollY === 0) {
        setIsPageScrollAllowed(true);
      }

      return newScrollY;
    });
  };

  useEffect(() => {
    if(safeUrls.length > 0){
      totalHeight.current = scrollElements.length * window.innerHeight;
    }
  }, [safeUrls, scrollElements.length]);

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (!isPageScrollAllowed) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    return () => window.removeEventListener("wheel", preventScroll);
  }, [isPageScrollAllowed]);

  if (!Array.isArray(urls) || safeUrls.length === 0) {
    return <div className="w-full h-96">Chargement en cours</div>;
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-screen bg-black"
        onWheel={handleScroll}
      >
        {/* Special element - first video found OR first element if no videos */}
        {isSpecialElementVideo ? (
          // Video version
          <div className="absolute w-full h-screen">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="/ryu.gif"
            >
              <source src={specialElement} type="video/mp4" />
            </video>
          </div>
        ) : (
          // Image version
          <div
            className="absolute w-full h-screen"
            style={{
              backgroundImage: `url(${specialElement})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
            }}
          />
        )}

        {/* All other elements - scroll in flow */}
        <div
          className="absolute w-full"
          style={{
            top: `${-scrollY}px`,
            transition: "top 0.1s ease-out",
          }}
        >
          {scrollElements.map((url, index) => (
            <div
              key={index}
              className="w-full h-screen relative"
              style={{
                backgroundImage: isVideoFile(url) ? 'none' : `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {isVideoFile(url) ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={url} type="video/mp4" />
                </video>
              ) : null}
              {/* Add gap between elements */}
              {index > 0 && <div className="h-[30px] bg-white absolute top-0 w-full"/>}
            </div>
          ))}
        </div>

        {/* OVERLAY CONTENT - Now overlays everything */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute z-10 flex flex-col items-center justify-center h-full w-full text-white text-center px-4 pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">DomeLovers</h1>
            <p className="text-xl md:text-2xl mb-8">skateboarding is not a crime</p>
            <button className="btn mx-2 border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-200 font-semibold transition-colors pointer-events-auto">
              <Link href={"/"}>Home</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiMarquee;
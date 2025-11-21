import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface ImageMarqueeProps {
  urls: string[];
}

const ImageMarquee = ({ urls }: ImageMarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const totalHeight = useRef(0);
  const [isPageScrollAllowed, setIsPageScrollAllowed] = useState(false);


  // Prevent default scroll behavior for the images, but allow it once the user reaches the end
  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault(); // Stop the page scroll behavior
    
    const scrollAmount = e.deltaY;

    setScrollY((prevScrollY) => {
      let newScrollY = prevScrollY + scrollAmount;

      // Prevent scrolling above the first image (above 0)
      newScrollY = Math.max(0, newScrollY);

      // Prevent scrolling beyond the last image (the last image shouldn't scroll off the screen)
      newScrollY = Math.min(newScrollY, totalHeight.current - window.innerHeight);

      // Check if we've reached the end of the images
      if (newScrollY === totalHeight.current - window.innerHeight) {
        setIsPageScrollAllowed(true); // Allow the page scroll once at the last image
      } else {
        setIsPageScrollAllowed(false); // Keep blocking page scroll if we're still in image range
      }

      // Allow page scrolling to the top when at the first image (or above it)
      if (newScrollY === 0) {
        setIsPageScrollAllowed(true); // Allow page scrolling when you're back at the top
      }

      return newScrollY;
    });
  };

  // Calculate the total height based on the number of images
  useEffect(() => {


    if(urls?.length > 0){
      totalHeight.current = urls.length * window.innerHeight; // Height of images without extra margin
    }


    
  }, [urls]);

  // Block page scrolling globally by listening to the wheel event on window
  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (!isPageScrollAllowed) {
        e.preventDefault(); // Block the page scroll if not allowed
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, [isPageScrollAllowed]);

  if (!Array.isArray(urls) || urls.length === 0) {
    console.log("ImageMarquee: 'urls' must be an array");
    return <div className="w-full h-96">Chargement en cours</div>;
  }

  const isVideoFile = (url: string): boolean => {
    const videoRegex = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv|3gp|m4v)(?:-[^?&#]*)?(?=[?&#]|$)/i;
    return videoRegex.test(url);
  };

  return (
    urls.length == 0 ? <div className="w-full h-96">Chargement en cours</div> :
    <>
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black"
      onWheel={handleScroll} // Handle scroll event only for images
    >
      {/* First image - background image */}
      { isVideoFile(urls[0]) ?
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
            <source src={urls[0]} type="video/mp4" />
            <source src="/hero-background.webm" type="video/webm" /> {/* Better compression */}
            </video>
            {/* Optional overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">DomeLovers</h1>
            <p className="text-xl md:text-2xl mb-8">skateboarding is not a crime</p>
            <button className="btn mx-2 border border-gray-300 bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-all duration-200 font-semibold transition-colors">
                <Link href={"/"}>Home</Link>
            </button>
        </div>
        </section>
        :
        <div
          className="absolute w-full h-screen"
          style={{
            backgroundImage: `url(${urls[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)", // Added shadow for depth
          }}
          onClick={() => {isVideoFile(urls[0])}}
        ></div>
      }


      {/* Images that will scroll */}
      <div
        className="absolute w-full"
        style={{
          top: `${-scrollY}px`, // Move images up based on scrollY value
          transition: "top 0.1s ease-out", // Smooth scrolling
        }}
      >
        
        {urls.slice(1).map((url, index) => (
          <div
            key={index}
            className="w-full h-screen relative"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "transform 0.1s ease-out", // Smooth transition on scroll
            }}
          >
            {/* Add a pseudo-element for the gap */}
            {0 < index ? <div className="h-[30px] bg-white"/> : ""}
          </div>
        ))}
      </div>
    </div></>
  );
};

export default ImageMarquee;
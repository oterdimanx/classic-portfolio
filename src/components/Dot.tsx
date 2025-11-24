import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DotProps {
  top: number
  left: number
  _id: string
  label: string
  _slug: string
  animationStage?: number
  index?: number
}

export default function Dot({ top, left, _id, label, _slug, animationStage = 0, index = 0 }: DotProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  
  const getTransition = () => {
    switch(animationStage) {
      case 0: // Initial entrance
        return `all 0.8s ease-out ${index * 100}ms`;
      case 1: // To final positions
        return `all 0.8s ease-out`;
      case 2: // To curved positions
        return `all 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms`;
      default:
        return 'none';
    }
  };

  return (
    <div 
      onClick={() => router.push(`/product/product-detail/${_slug}`)}
      className="absolute w-4 h-4 bg-white rounded-full cursor-pointer animate-blink z-10 hover:bg-gray-300 hover:scale-110 transition-all duration-300"
      style={{ 
        top: `${top}%`, 
        left: `${left}%`,
        transition: getTransition()
      }}
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  )
}
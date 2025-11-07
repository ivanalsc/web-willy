import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div className='w-full h-full flex items-center justify-center mb-8'>
    <Image 
    src="/Automatic.gif"
    alt="SONGOD"
    width={1000}
    height={500}
    className='hero'
    />
    </div>
  )
}

export default Hero
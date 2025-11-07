import { Instagram, Mail } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Contact = () => {
  return (
    <div id='contacto' className='flex items-center justify-around'>
        <div className='flex flex-col items-start gap-4'>
          <p>Por consultas, escribime a <a href="mailto:srpaez@gmail.com" className='underline'>srpaez@gmail.com</a></p>
        
        </div>
        <div>
            <Image
            src="/unaflor.gif"
            alt=""
            width={300}
            height={300}
            />
        </div>

    </div>
  )
}

export default Contact
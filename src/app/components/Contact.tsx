import { Instagram, Mail } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Contact = () => {
  return (
    <div id='contacto' className='flex items-center justify-around'>
        <div className='flex items-center gap-4'>
        <Instagram className="h-10 w-10" />
        <Mail className="h-10 w-10" />
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
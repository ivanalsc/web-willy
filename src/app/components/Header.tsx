"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200">
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-center">
        
        {/* Left */}
        <nav className="absolute left-4 sm:left-6 lg:left-8 flex items-center gap-6">
          <Link href="/" className="text-sm font-medium black-text hover:text-gray-600 transition-colors">
            SONGOD
          </Link>
          <Link href="#about" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors hidden sm:block">
            About
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/songod-animated-gif.gif"
            alt="SONGOD Logo"
            width={150}
            height={150}
            priority
            unoptimized
            className="h-16 sm:h-20 w-auto mx-auto"
          />
        </div>

        {/* Right */}
        <div className="absolute right-4 sm:right-6 lg:right-8 flex gap-4">
          <Link
            href="#contacto"
            className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          >
            Contacto
          </Link>
          <Link href="#">
        <Instagram className="h-5 w-5" />
          
          </Link>
        </div>

      </div>
    </header>
  )
}

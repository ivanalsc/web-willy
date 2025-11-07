"use client"

import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
              SONGOD ®
            </Link>
            <Link href="#about" className=" font-medium text-gray-900 hover:text-gray-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Center Logo - Animated */}
          <div className="flex-shrink-0">
            <Image
              src="/songod-animated-gif.gif"
              alt="SONGOD Logo"
              width={150}
              height={150}
              priority
              unoptimized
              className="h-30 w-auto"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 min-w-[200px]">
            <a
              href="#contacto"
              className="text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Instagram"
            >
              Contacto
            </a>
          
          </div>
        </div>
      </div>
    </header>
  )
}


import { getArtworks } from '@/lib/notion-client';
import Link from 'next/link';
import About from './components/About';
import './gallery.css';
import Hero from './components/Hero';
import Contact from './components/Contact';
import SafeImage from './components/SafeImage';

export const revalidate = 300;

export default async function Home() {
  const artworks = await getArtworks();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Hero />
          <About />
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl font-bold black-text">
             OBRAS
            </h2>
         
          </div>

        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {artworks.map((artwork, index) => (
            <Link
              key={artwork.id}
              href={`/artwork/${artwork.id}`}
              className="group relative block animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <article className="gallery-card">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <>
                    {/* Overlay gradient on hover */}
                    <div className="gallery-overlay"></div>
                    
                    <SafeImage
                      src={artwork.image || ''}
                      alt={artwork.title}
                      fill
                      className="gallery-image"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    
                    {/* Floating "Ver más" badge */}
                    {/* <div className="gallery-badge">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 shadow-lg">
                        Ver más
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div> */}
                  </>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h2 className="gallery-title px-3 black-text">
                    {artwork.title}
                  </h2>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {artwork.technique ? (
                      <span className="inline-flex items-center px-3 py-1 ">
                        {artwork.technique}
                      </span>
                    ) : null}
                  
                  </div>

                  {/* Extra Info */}
                  {artwork.extraInfo ? (
                    <p className="text-xs  text-gray-600 px-3 line-clamp-2 leading-relaxed">
                      {artwork.extraInfo}
                    </p>
                  ) : null}
                    {artwork.year ? (
                      <span className="inline-flex items-center px-3 py-1  bg-gray-100 text-gray-700 font-medium text-center w-full justify-center">
                        {artwork.year}
                      </span>
                    ) : null}
                </div>

                {/* Bottom accent line */}
                <div className="gallery-accent"></div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {artworks.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              No hay obras disponibles
            </h3>
            <p className="text-gray-600">
              Vuelve pronto para descubrir nuevas obras de arte
            </p>
          </div>
        )}
      </div>
      <Contact />
    </main>
  );
}
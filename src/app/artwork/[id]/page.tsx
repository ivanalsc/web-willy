// app/artwork/[id]/page.tsx
import { getArtwork, getArtworks } from '@/lib/notion-client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

// Generar static params para ISR
export async function generateStaticParams() {
  const artworks = await getArtworks();
  
  return artworks.map((artwork) => ({
    id: artwork.id,
  }));
}

export default async function ArtworkPage({ params }: { params: { id: string } }) {
  const artwork = await getArtwork(params.id);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Volver a la galería
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Imagen */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl">
            {artwork.image ? (
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {artwork.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-lg">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-semibold text-gray-700">Técnica:</span>
                  <span className="ml-2">{artwork.technique}</span>
                </div>
                
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-semibold text-gray-700">Año:</span>
                  <span className="ml-2">{artwork.year}</span>
                </div>
              </div>
            </div>

            {artwork.extraInfo && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {artwork.extraInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
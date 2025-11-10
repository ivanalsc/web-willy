// app/artwork/[id]/page.tsx
import { getArtwork, getArtworks } from '@/lib/notion-client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SafeImage from '@/app/components/SafeImage';

export const revalidate = 3600;

// Generar static params para ISR
export async function generateStaticParams() {
  const artworks = await getArtworks();
  
  return artworks.map((artwork) => ({
    id: artwork.id,
  }));
}

export default async function ArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artwork = await getArtwork(id);

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
          <div className="relative w-full aspect-square overflow-hidden shadow-2xl">
            <SafeImage
              src={artwork.image || ''}
              alt={artwork.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 black-text">
                {artwork.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-lg">
                <div className="bg-gray-100 px-4 py-2">
                  <span className="font-semibold text-gray-700">Técnica:</span>
                  <span className="ml-2">{artwork.technique}</span>
                </div>
                
                <div className="bg-gray-100 px-4 py-2">
                  <span className="font-semibold text-gray-700">Año:</span>
                  <span className="ml-2">{artwork.year}</span>
                </div>
                
                {artwork.priceFormatted && (
                  <div className="bg-gray-100 px-4 py-2">
                    <span className="font-semibold text-gray-700">Precio:</span>
                    <span className="ml-2">{artwork.priceFormatted}</span>
                  </div>
                )}
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
              <Link href="#" className='flex items-center gap-2 border px-4 py-2 w-fit'><span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path></svg>
                    </span>Consultar</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
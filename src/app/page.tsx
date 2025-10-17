// app/page.tsx
import { getArtworks } from '@/lib/notion-client';
import Image from 'next/image';

export const revalidate = 3600; // Revalidar cada hora

export default async function Home() {
  const artworks = await getArtworks();

  console.log('Artworks fetched:', artworks);

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Galería de Arte</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artworks.map((artwork) => (
          <div 
            key={artwork.id} 
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-square relative bg-gray-100">
              {artwork.image && (
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
            
            <div className="p-4 bg-white">
              <h2 className="text-xl font-semibold mb-2">{artwork.title}</h2>
              
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span className="font-medium">{artwork.technique}</span>
                <span>{artwork.year}</span>
              </div>
              
              {artwork.extraInfo && (
                <p className="text-sm text-gray-700 mt-2">{artwork.extraInfo}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
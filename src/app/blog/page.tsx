// app/blog/page.tsx
import { getBlogPosts } from '@/lib/notion-client';
import Image from 'next/image';
import Link from 'next/link';

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="space-y-8">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="border-b border-gray-200 pb-8 last:border-b-0"
          >
            <Link 
              href={`/blog/${post.slug}`}
              className="group"
            >
              {post.coverImage && (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              )}
              
              <time className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <h2 className="text-2xl font-bold mt-2 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600">
                {post.excerpt}
              </p>
              
              <span className="inline-block mt-3 text-blue-600 group-hover:underline">
                Leer más →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
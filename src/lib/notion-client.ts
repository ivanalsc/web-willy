// lib/notion-client.ts
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY no está definida en las variables de entorno');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Tipos para Artworks
export interface Artwork {
  id: string;
  title: string;
  image: string;
  technique: string;
  year: number;
  extraInfo: string;
}

// Tipos para Blog Posts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  date: string;
  content?: string;
}

// Obtener Artworks
export async function getArtworks(): Promise<Artwork[]> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_ARTWORKS_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Año',
            direction: 'descending',
          },
        ],
      }),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching artworks: ${response.statusText}`);
  }

  const data = await response.json();

  return data.results.map((page: any) => {
    const props = page.properties;
    
    return {
      id: page.id,
      title: props.Título?.title?.[0]?.plain_text || '',
      image: props.Imagen?.files?.[0]?.file?.url || props.Imagen?.files?.[0]?.external?.url || '',
      technique: props.Técnica?.rich_text?.[0]?.plain_text || '',
      year: props.Año?.number || 0,
      extraInfo: props['Info Extra']?.rich_text?.[0]?.plain_text || '',
    };
  });
}

// Obtener un artwork individual
export async function getArtwork(id: string): Promise<Artwork | null> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/pages/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const page: any = await response.json();
    const props = page.properties;
    
    return {
      id: page.id,
      title: props.Título?.title?.[0]?.plain_text || '',
      image: props.Imagen?.files?.[0]?.file?.url || props.Imagen?.files?.[0]?.external?.url || '',
      technique: props.Técnica?.rich_text?.[0]?.plain_text || '',
      year: props.Año?.number || 0,
      extraInfo: props['Info Extra']?.rich_text?.[0]?.plain_text || '',
    };
  } catch (error) {
    return null;
  }
}

// Obtener Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_BLOG_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      }),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching blog posts: ${response.statusText}`);
  }

  const data = await response.json();

  return data.results.map((page: any) => {
    const props = page.properties;
    
    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text || '',
      slug: props.Slug?.rich_text?.[0]?.plain_text || '',
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
      coverImage: props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || '',
      date: props.Date?.date?.start || '',
    };
  });
}

// Obtener un post individual con contenido
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${process.env.NOTION_BLOG_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      }),
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Error fetching blog post: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.results.length === 0) {
    return null;
  }

  const page: any = data.results[0];
  const props = page.properties;
  
  // Convertir el contenido de Notion a Markdown
  const mdblocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdblocks);

  return {
    id: page.id,
    title: props.Title?.title?.[0]?.plain_text || '',
    slug: props.Slug?.rich_text?.[0]?.plain_text || '',
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
    coverImage: props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || '',
    date: props.Date?.date?.start || '',
    content: mdString.parent,
  };
}
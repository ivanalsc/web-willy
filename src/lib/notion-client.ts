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

function formatCurrency(value?: number | null): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }

  try {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.warn('Error formateando precio:', error);
    return value.toString();
  }
}

// Tipos para Artworks
export interface Artwork {
  id: string;
  title: string;
  image: string;
  technique: string;
  year: number;
  extraInfo: string;
  price: number | null;
  priceFormatted: string;
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
    console.log("props:", props);
    const priceValue = typeof props.Precio?.number === 'number' ? props.Precio.number : null;
    
    // Obtener URL de imagen con mejor manejo
    let imageUrl = '';
    const imageFile = props.Imagen?.files?.[0];
    if (imageFile) {
      // Priorizar file.url (archivos de Notion) sobre external.url
      imageUrl = imageFile.file?.url || imageFile.external?.url || '';
      
      // Validar que la URL sea válida
      if (imageUrl) {
        // Asegurarse de que la URL sea absoluta
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `https://${imageUrl}`;
        }
        
        // Validar formato de URL
        try {
          new URL(imageUrl);
        } catch (e) {
          console.warn('URL de imagen inválida:', imageUrl);
          imageUrl = '';
        }
      }
    }
    
    return {
      id: page.id,
      title: props['Título - Title']?.title?.[0]?.plain_text || '',
      image: imageUrl,
      technique: props.Técnica?.rich_text?.[0]?.plain_text || '',
      year: props.Año?.number || 0,
      extraInfo: props['Info Extra']?.rich_text?.[0]?.plain_text || '',
      price: priceValue,
      priceFormatted: formatCurrency(priceValue),
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
    const priceValue = typeof props.Precio?.number === 'number' ? props.Precio.number : null;
    
    // Obtener URL de imagen con mejor manejo
    let imageUrl = '';
    const imageFile = props.Imagen?.files?.[0];
    if (imageFile) {
      // Priorizar file.url (archivos de Notion) sobre external.url
      imageUrl = imageFile.file?.url || imageFile.external?.url || '';
      
      // Validar que la URL sea válida
      if (imageUrl) {
        // Asegurarse de que la URL sea absoluta
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `https://${imageUrl}`;
        }
        
        // Validar formato de URL
        try {
          new URL(imageUrl);
        } catch (e) {
          console.warn('URL de imagen inválida:', imageUrl);
          imageUrl = '';
        }
      }
    }
    
    return {
      id: page.id,
      title: props['Título - Title']?.title?.[0]?.plain_text || '',
      image: imageUrl,
      technique: props.Técnica?.rich_text?.[0]?.plain_text || '',
      year: props.Año?.number || 0,
      extraInfo: props['Info Extra']?.rich_text?.[0]?.plain_text || '',
      price: priceValue,
      priceFormatted: formatCurrency(priceValue),
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
      title: props['Título - Title']?.title?.[0]?.plain_text || '',
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
    title: props['Título - Title']?.title?.[0]?.plain_text || '',
    slug: props.Slug?.rich_text?.[0]?.plain_text || '',
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text || '',
    coverImage: props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || '',
    date: props.Date?.date?.start || '',
    content: mdString.parent,
  };
}
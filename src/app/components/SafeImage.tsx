'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  style,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [imageKey, setImageKey] = useState(0);

  // Resetear estado cuando src cambia
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
    setImageKey((prev) => prev + 1);
  }, [src]);

  // Validar que la URL no esté vacía
  if (!src || src.trim() === '') {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className || ''}`}
        style={fill ? { position: 'absolute', inset: 0, ...style } : { width, height, ...style }}
      >
        <span className="text-gray-400 text-sm">Sin imagen</span>
      </div>
    );
  }

  // Si hubo un error, mostrar placeholder
  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className || ''}`}
        style={fill ? { position: 'absolute', inset: 0, ...style } : { width, height, ...style }}
      >
        <span className="text-gray-400 text-sm text-center px-4">
          No se pudo cargar la imagen
        </span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div 
          className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className || ''}`}
          style={fill ? { position: 'absolute', inset: 0, zIndex: 1, ...style } : { width, height, ...style }}
        >
          <div className="animate-pulse w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
        </div>
      )}
      <Image
        key={imageKey}
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        style={{ ...style, opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
        // A veces el primer request puede fallar por un 403/timeout transitorio.
        // Permitimos un reintento silencioso antes de mostrar el placeholder.
        onError={() => {
          if (retryCount < 1) {
            setRetryCount((prev) => prev + 1);
            setIsLoading(true);
            setHasError(false);
            setImageKey((prev) => prev + 1); // fuerza a Next/Image a reintentar
            return;
          }
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
      />
    </>
  );
}


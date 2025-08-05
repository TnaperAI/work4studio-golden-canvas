import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  priority = false,
  quality = 80 
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Генерация оптимизированного URL (если это изображение из Supabase)
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('supabase.co') && width && height) {
      // Добавляем параметры для ресайза изображения
      const url = new URL(originalSrc);
      url.searchParams.set('width', width.toString());
      url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', quality.toString());
      url.searchParams.set('format', 'webp');
      return url.toString();
    }
    return originalSrc;
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={width && height ? { aspectRatio: `${width}/${height}` } : undefined}
        />
      )}
      
      {/* Основное изображение */}
      {isInView && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          style={{ 
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
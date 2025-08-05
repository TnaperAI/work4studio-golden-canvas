import { lazy } from 'react';

// Lazy loading для больших компонентов
export const AdminDashboard = lazy(() => import('@/components/admin/AdminDashboard'));
export const ContactFormModal = lazy(() => import('@/components/ContactFormModal'));
export const ImageGalleryModal = lazy(() => import('@/components/ImageGalleryModal'));
export const BackgroundAnimation = lazy(() => import('@/components/BackgroundAnimation'));

// Preload критические компоненты для более быстрой загрузки
export const preloadCriticalComponents = () => {
  // Предзагружаем важные компоненты
  import('@/components/Hero');
  import('@/components/Header');
  import('@/components/Footer');
};
import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    // Проверяем поддержку Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Fallback: сразу добавляем класс всем элементам
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Отключаем наблюдение после первого появления для лучшей производительности
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
};
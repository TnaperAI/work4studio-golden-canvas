import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to replace hover classes with mobile-friendly versions
const replaceHoverClasses = (className: string): string => {
  return className
    .replace(/hover:scale-105/g, 'hover-scale')
    .replace(/hover:scale-110/g, 'hover-scale-110') 
    .replace(/hover:shadow-xl/g, 'hover-shadow-xl')
    .replace(/hover:shadow-2xl/g, 'hover-shadow-2xl')
    .replace(/hover:opacity-90/g, 'hover-opacity-90')
    .replace(/hover:opacity-80/g, 'hover-opacity-80')
    .replace(/hover:bg-primary/g, 'hover-bg-primary')
    .replace(/hover:bg-secondary/g, 'hover-bg-secondary')
    .replace(/hover:text-primary/g, 'hover-text-primary')
    .replace(/hover:text-primary-foreground/g, 'hover-text-primary-foreground')
    .replace(/hover:border-primary/g, 'hover-border-primary')
    .replace(/hover:translate-x-1/g, 'hover-translate-x-1')
    .replace(/hover:underline/g, 'hover-underline')
    .replace(/group-hover:scale-105/g, 'group-hover-scale-105')
    .replace(/group-hover:scale-110/g, 'group-hover-scale-110')
    .replace(/group-hover:opacity-100/g, 'group-hover-opacity-100')
    .replace(/group-hover:rotate-3/g, 'group-hover-rotate-3')
    .replace(/group-hover:translate-x-1/g, 'group-hover-translate-x-1');
};

export function cn(...inputs: ClassValue[]) {
  const mergedClasses = twMerge(clsx(inputs));
  return replaceHoverClasses(mergedClasses);
}

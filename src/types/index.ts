/**
 * Core type definitions for the application
 */

export interface NavigationItem {
  label: string;
  path: string;
  description?: string;
}

export interface ThumbnailItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface PageContent {
  title: string;
  subtitle?: string;
  backgroundClass: string;
}

export interface ContentSection {
  type: string;
  content: unknown;
  className?: string;
}

// Component prop interfaces
export interface NavigationProps {
  items: NavigationItem[];
  currentPath?: string;
  className?: string;
}

export interface ThumbnailGridProps {
  items: ThumbnailItem[];
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
}

export interface HomePageProps {
  content: PageContent;
  navigationItems: NavigationItem[];
  thumbnailItems: ThumbnailItem[];
  className?: string;
}
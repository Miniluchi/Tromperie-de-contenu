import type { ThumbnailGridProps } from "../types";
import { cn } from "../lib/utils";

export function ThumbnailGrid({ items, className, columns }: ThumbnailGridProps) {
  // Default responsive column configuration
  const defaultColumns = {
    mobile: 1,
    tablet: 2, 
    desktop: 3,
    large: 4
  };

  const gridColumns = { ...defaultColumns, ...columns };

  // Convert column numbers to Tailwind classes
  const getGridClasses = () => {
    const gridClasses = [];
    
    // Mobile (default)
    gridClasses.push(`grid-cols-${gridColumns.mobile}`);
    
    // Tablet
    if (gridColumns.tablet) {
      gridClasses.push(`md:grid-cols-${gridColumns.tablet}`);
    }
    
    // Desktop  
    if (gridColumns.desktop) {
      gridClasses.push(`lg:grid-cols-${gridColumns.desktop}`);
    }
    
    // Large
    if (gridColumns.large) {
      gridClasses.push(`xl:grid-cols-${gridColumns.large}`);
    }

    return gridClasses.join(' ');
  };

  return (
    <div
      className={cn(
        "grid gap-4 w-full",
        getGridClasses(),
        className
      )}
      data-testid="thumbnail-grid"
    >
      {items.map((item, index) => (
        <div
          key={`${item.src}-${index}`}
          className="aspect-video overflow-hidden rounded-lg hover:scale-105 transition-transform duration-200"
          data-testid="thumbnail-item"
        >
          <img
            src={item.src}
            alt={item.alt}
            title={item.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Handle broken images gracefully
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGMyVGNEY2Ii8+PHRleHQgeD0iMTYwIiB5PSI5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOUI5Q0E0Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
            }}
          />
        </div>
      ))}
    </div>
  );
}
import type { HomePageProps } from "../types";
import { Navigation } from "../components/Navigation";
import { ThumbnailMarquee } from "../components/ThumbnailMarquee";
import { cn } from "../lib/utils";

export function HomePage({ content, navigationItems, thumbnailItems, className }: HomePageProps) {
  return (
    <div className={cn("min-h-screen w-full overflow-x-hidden", className)}>
      {/* Navigation */}
      <Navigation items={navigationItems} />
      
      {/* Main content */}
      <main 
        className={cn(
          "min-h-screen w-full overflow-x-hidden",
          content.backgroundClass
        )}
        role="main"
      >
        {/* Main title */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 md:px-8 lg:px-12 pt-8 md:pt-12">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="text-lg md:text-xl text-gray-300">
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Marquees infinis avec shadcn/ui - pleine largeur */}
        <div className="w-full space-y-0">
          <ThumbnailMarquee 
            items={thumbnailItems.slice(0, 8)} 
            direction="right"
          />
          <ThumbnailMarquee 
            items={thumbnailItems} 
            direction="left"
          />
        </div>
      </main>
    </div>
  );
}
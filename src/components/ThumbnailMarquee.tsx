import type { ThumbnailItem } from "../types";
import { cn } from "../lib/utils";
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
} from "./ui/shadcn-io/marquee/index";

interface ThumbnailMarqueeProps {
  items: ThumbnailItem[];
  direction: "left" | "right";
  className?: string;
}

export function ThumbnailMarquee({
  items,
  direction,
  className,
}: ThumbnailMarqueeProps) {
  return (
    <div
      className={cn("w-full", className)}
      data-testid="carousel-container"
      data-direction={direction}
    >
      <Marquee className="w-full overflow-visible">
        <MarqueeContent
          direction={direction}
          speed={20} // Défilement lent
          pauseOnHover={true}
          autoFill={true}
        >
          {items.map((item, index) => (
            <MarqueeItem
              key={`${item.src}-${index}`}
              className="mx-5 py-5"
              data-testid="carousel-item"
            >
              <div className="group cursor-pointer transition-all duration-300 hover:scale-125 hover:shadow-2xl shadow-lg">
                <div className="relative aspect-video w-64 overflow-hidden rounded-lg">
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSIxNjAiIHk9IjkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTkiPkV4ZW1wbGUgZGUgdHJvbXBlcmllPC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />

                  {/* Overlay avec titre au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-3 w-full">
                      <h3 className="text-white font-medium text-sm truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
      </Marquee>
    </div>
  );
}

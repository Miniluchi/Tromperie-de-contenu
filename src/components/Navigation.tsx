import { Link, useLocation } from "react-router-dom";
import type { NavigationProps } from "../types";
import { cn } from "../lib/utils";

export function Navigation({ items, currentPath, className }: NavigationProps) {
  const location = useLocation();
  const activePath = currentPath || location.pathname;

  return (
    <nav 
      className={cn(
        "bg-black border-b border-gray-700 text-white flex items-center justify-center gap-8 p-4",
        className
      )}
      role="navigation"
      aria-label="Navigation principale"
    >
      {items.map((item) => {
        const isActive = activePath === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "text-white transition-all duration-200 px-4 py-2 rounded-full text-sm font-medium",
              isActive 
                ? "bg-gray-800 text-gray-200" 
                : "hover:bg-gray-700 hover:text-white"
            )}
            data-active={isActive}
            aria-label={item.description}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
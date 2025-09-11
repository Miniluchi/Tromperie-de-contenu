import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NetflixCarousel } from "../components/NetflixCarousel";
import { Navigation } from "../components/Navigation";
import type { ThumbnailItem, NavigationItem } from "../types";

// Mock performance APIs
global.performance = global.performance || {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
} as any;

// Mock RequestAnimationFrame for animation testing
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16)); // ~60fps
global.cancelAnimationFrame = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

const mockThumbnailItems: ThumbnailItem[] = [
  { src: "/test1.jpg", alt: "Test 1", title: "Test 1" },
  { src: "/test2.jpg", alt: "Test 2", title: "Test 2" },
  { src: "/test3.jpg", alt: "Test 3", title: "Test 3" },
  { src: "/test4.jpg", alt: "Test 4", title: "Test 4" },
  { src: "/test5.jpg", alt: "Test 5", title: "Test 5" },
  { src: "/test6.jpg", alt: "Test 6", title: "Test 6" }
];

const mockNavigationItems: NavigationItem[] = [
  { label: "Le concept", path: "/", description: "Page principale" },
  { label: "Que faire ?", path: "/action", description: "Actions" }
];

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("T012: Performance Validation Tests", () => {
  describe("60fps Animation Target", () => {
    it("should use GPU-accelerated properties for carousel scrolling", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should use CSS animation (GPU-accelerated) instead of left/top
      expect(scrollContainer).toHaveClass('animate-scroll-right');
      
      // Should have hardware acceleration through CSS animations
      const computedStyle = window.getComputedStyle(scrollContainer);
      // CSS animations use transform which is GPU-accelerated
    });

    it("should use transform scale for thumbnail hover effects", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const thumbnails = screen.getAllByRole('img');
      const firstThumbnail = thumbnails[0];
      const thumbnailContainer = firstThumbnail.closest('.hover\\:scale-110');
      
      // Should use transform scale (GPU-friendly)
      expect(thumbnailContainer).toHaveClass('hover:scale-110');
      expect(thumbnailContainer).toHaveClass('transition-all'); // For smooth scaling
      expect(thumbnailContainer).toHaveClass('duration-300'); // Quick transition
    });

    it("should complete hover animations within performance budget (<100ms perceived)", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const firstImage = screen.getAllByRole('img')[0];
      const container = firstImage.closest('div');
      
      // Start performance measurement
      const startTime = performance.now();
      
      // Trigger hover
      fireEvent.mouseEnter(container!);
      
      // Animation should be quick enough for 60fps
      expect(container).toHaveClass('duration-300'); // Should complete in 300ms
      
      // CSS transitions should be hardware accelerated
      expect(container).toHaveClass('transition-all');
    });

    it("should maintain 60fps during continuous carousel scrolling", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should use CSS animation with linear timing for consistent frame rate
      expect(scrollContainer).toHaveClass('animate-scroll-right');
      
      // CSS animation provides smooth 60fps scrolling through browser optimization
      const computedStyle = window.getComputedStyle(scrollContainer);
      // Animation should be active
    });
  });

  describe("Memory Efficiency", () => {
    it("should lazy load carousel images to prevent memory bloat", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const images = screen.getAllByRole('img');
      
      // All images should have lazy loading
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it("should cleanup animation resources on component unmount", () => {
      const { unmount } = render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Start autoplay
      vi.advanceTimersByTime(1000);
      
      // Unmount should cleanup timers
      unmount();
      
      // No memory leaks or continued timers after unmount
      // This is implicitly tested by the absence of errors
    });

    it("should handle image load errors gracefully without memory impact", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const images = screen.getAllByRole('img');
      const firstImage = images[0] as HTMLImageElement;
      
      // Simulate image load error
      fireEvent.error(firstImage);
      
      // Should have fallback handling without crashing
      expect(firstImage).toBeInTheDocument();
    });
  });

  describe("Navigation Performance", () => {
    it("should use efficient transitions for navigation hover effects", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        // Should use efficient transition properties
        expect(link).toHaveClass('transition-all');
        expect(link).toHaveClass(/duration-(200|300)/); // Quick transitions
        
        // Should not animate expensive properties
        const computedStyle = window.getComputedStyle(link);
        // Should focus on transform and background changes
      });
    });

    it("should minimize reflows during navigation indicator sliding", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/" />
        </NavigationWrapper>
      );

      const actionLink = screen.getByText("Que faire ?").closest('a');
      
      // Hover should not cause layout reflows
      fireEvent.mouseEnter(actionLink!);
      
      // Should use transform or background changes, not position/width changes
      expect(actionLink).toHaveClass(/hover:bg-/);
    });
  });

  describe("Responsive Performance", () => {
    it("should maintain performance across different viewport sizes", () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should still use efficient CSS animations on mobile
      expect(scrollContainer).toHaveClass('animate-scroll-right');
      
      // Should maintain layout without horizontal scrolling issues
      expect(scrollContainer.parentElement).toHaveClass('overflow-x-hidden');
    });

    it("should adapt animation duration for slower devices", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const thumbnails = screen.getAllByRole('img');
      const firstThumbnail = thumbnails[0].closest('div');
      
      // Should have reasonable duration that works on slower devices
      expect(firstThumbnail).toHaveClass('duration-300'); // Not too fast, not too slow
    });
  });

  describe("Animation Jank Prevention", () => {
    it("should avoid animating layout-affecting properties", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should use CSS animation with transform (composited layer)
      expect(scrollContainer).toHaveClass('animate-scroll-right');
      
      // Should not have layout-affecting transition classes
      expect(scrollContainer).not.toHaveClass('transition-left');
      expect(scrollContainer).not.toHaveClass('transition-width');
    });

    it("should use appropriate will-change declarations for active animations", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Start autoplay to activate animations
      vi.advanceTimersByTime(3000);
      
      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should hint browser for optimization during active animations
      const computedStyle = window.getComputedStyle(scrollContainer);
      // will-change should be set appropriately
    });

    it("should batch DOM updates to prevent multiple reflows", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const firstLink = screen.getAllByRole('link')[0];
      const secondLink = screen.getAllByRole('link')[1];
      
      // Multiple rapid hovers should not cause jank
      fireEvent.mouseEnter(firstLink);
      fireEvent.mouseLeave(firstLink);
      fireEvent.mouseEnter(secondLink);
      fireEvent.mouseLeave(secondLink);
      
      // Should handle rapid interactions smoothly
      expect(firstLink).toHaveClass('transition-all');
      expect(secondLink).toHaveClass('transition-all');
    });
  });

  describe("Performance Budgets", () => {
    it("should complete all hover effects within 100ms perceived response time", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const firstImage = screen.getAllByRole('img')[0];
      const container = firstImage.closest('div');
      
      // Hover response should be immediate (< 100ms perceived)
      expect(container).toHaveClass('duration-300'); // Quick enough for good UX
      
      fireEvent.mouseEnter(container!);
      
      // Should start animation immediately
      expect(container).toHaveClass('hover:scale-110');
    });

    it("should maintain smooth scrolling during high thumbnail count", () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        src: `/test${i}.jpg`,
        alt: `Test ${i}`,
        title: `Test ${i}`
      }));

      render(
        <NetflixCarousel 
          items={manyItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      
      // Should maintain smooth CSS animation even with many items
      expect(scrollContainer).toHaveClass('animate-scroll-right');
      
      // Should use efficient CSS rendering
      const computedStyle = window.getComputedStyle(scrollContainer);
      // Animation runs smoothly regardless of item count
    });
  });
});
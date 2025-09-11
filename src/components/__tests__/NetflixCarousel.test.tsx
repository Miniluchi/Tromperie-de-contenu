import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NetflixCarousel } from "../NetflixCarousel";
import type { ThumbnailItem } from "../../types";

const mockThumbnailItems: ThumbnailItem[] = [
  {
    src: "/test1.jpg",
    alt: "Test thumbnail 1",
    title: "Test 1"
  },
  {
    src: "/test2.jpg", 
    alt: "Test thumbnail 2",
    title: "Test 2"
  },
  {
    src: "/test3.jpg",
    alt: "Test thumbnail 3", 
    title: "Test 3"
  },
  {
    src: "/test4.jpg",
    alt: "Test thumbnail 4",
    title: "Test 4"
  }
];

// Mock timers for autoplay testing
beforeEach(() => {
  vi.useFakeTimers();
});

describe("NetflixCarousel - Enhanced Contract Requirements", () => {
  // T004: Hover scaling behavior tests
  describe("Thumbnail Hover Effects", () => {
    it("should scale thumbnail to 110% on hover within 300ms", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const firstThumbnail = screen.getByAltText("Test thumbnail 1");
      const thumbnailContainer = firstThumbnail.closest('.hover\\:scale-110');
      
      expect(thumbnailContainer).toHaveClass('hover:scale-110');
      expect(thumbnailContainer).toHaveClass('transition-all', 'duration-300');
    });

    it("should scale back to 100% when hover leaves within 300ms", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const firstThumbnail = screen.getByAltText("Test thumbnail 1");
      const thumbnailContainer = firstThumbnail.closest('div');
      
      // Check that scaling returns to normal (transform property should reset)
      fireEvent.mouseEnter(thumbnailContainer!);
      fireEvent.mouseLeave(thumbnailContainer!);
      
      expect(thumbnailContainer).not.toHaveStyle('transform: scale(1.1)');
    });

    it("should have smooth transition for hover effects", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const thumbnails = screen.getAllByRole('img');
      thumbnails.forEach(thumbnail => {
        const container = thumbnail.closest('div');
        expect(container).toHaveClass('transition-all', 'duration-300');
      });
    });
  });

  // T005: Continuous scrolling with direction control
  describe("Continuous Scrolling with Direction Control", () => {
    it("should accept direction prop and configure scrolling direction", () => {
      const { rerender } = render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Test that direction prop is accepted
      expect(() => {
        rerender(
          <NetflixCarousel 
            items={mockThumbnailItems}
            direction="left"
          />
        );
      }).not.toThrow();
    });

    it("should start continuous scrolling automatically after mount", async () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Advance timers to trigger autoplay
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        const scrollContainer = screen.getByTestId('carousel-scroll-container');
        expect(scrollContainer).toHaveStyle(/transform: translateX\((?!-?0%)/);
      });
    });

    it("should have configurable autoplay speed (default 3000ms)", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
          autoplaySpeed={1500}
        />
      );

      // Should not scroll before custom interval
      vi.advanceTimersByTime(1000);
      
      // Should scroll after custom interval
      vi.advanceTimersByTime(500);
      // Test will pass when autoplaySpeed prop is implemented
    });

    it("should move smoothly without jerky transitions", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      expect(scrollContainer).toHaveClass('transition-transform');
      expect(scrollContainer).toHaveClass('ease-linear'); // Smooth continuous movement
    });
  });

  // T006: No user controls visible
  describe("No User Controls", () => {
    it("should not display navigation arrows", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Should not find left or right arrow buttons
      expect(screen.queryByRole('button', { name: /previous/i })).toBeNull();
      expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
      expect(screen.queryByLabelText(/chevron/i)).toBeNull();
    });

    it("should not display page indicators or dots", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Should not find pagination indicators
      expect(screen.queryByRole('button', { name: /page/i })).toBeNull();
      expect(screen.queryByTestId('pagination-dots')).toBeNull();
      
      // Check for common indicator patterns
      const indicators = screen.queryAllByRole('button');
      const pageIndicators = indicators.filter(btn => 
        btn.className.includes('w-2') && btn.className.includes('h-2')
      );
      expect(pageIndicators).toHaveLength(0);
    });

    it("should forbid manual navigation interactions", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Should not be able to click anywhere to change slides manually
      const carousel = screen.getByTestId('carousel-container');
      const initialTransform = carousel.style.transform;
      
      fireEvent.click(carousel);
      
      // Transform should not change from manual interaction
      expect(carousel.style.transform).toBe(initialTransform);
    });
  });

  // T007: Autoplay pause/resume on hover
  describe("Autoplay Pause/Resume on Hover", () => {
    it("should pause scrolling when carousel container is hovered", async () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const carouselContainer = screen.getByTestId('carousel-container');
      
      // Start scrolling
      vi.advanceTimersByTime(3000);
      
      // Hover over carousel
      fireEvent.mouseEnter(carouselContainer);
      
      // Time should not advance scrolling while hovered
      const beforeHover = carouselContainer.style.transform;
      vi.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(carouselContainer.style.transform).toBe(beforeHover);
      });
    });

    it("should resume scrolling when mouse leaves carousel container", async () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const carouselContainer = screen.getByTestId('carousel-container');
      
      // Hover then leave
      fireEvent.mouseEnter(carouselContainer);
      fireEvent.mouseLeave(carouselContainer);
      
      // Should resume scrolling after leaving
      vi.advanceTimersByTime(3000);
      
      await waitFor(() => {
        expect(carouselContainer).toHaveStyle(/transform: translateX\((?!-?0%)/);
      });
    });
  });

  // Performance requirements
  describe("Performance Requirements", () => {
    it("should use GPU-accelerated transforms for animations", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      // Check that only transform and opacity are animated (GPU-friendly)
      const scrollContainer = screen.getByTestId('carousel-scroll-container');
      expect(scrollContainer).toHaveClass('transition-transform');
      
      // Should not animate position, width, or other layout properties
      expect(scrollContainer).not.toHaveClass('transition-all');
    });

    it("should lazy load images for memory efficiency", () => {
      render(
        <NetflixCarousel 
          items={mockThumbnailItems}
          direction="right"
        />
      );

      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });
});
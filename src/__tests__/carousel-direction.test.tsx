import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import type { PageContent, NavigationItem, ThumbnailItem } from "../types";

// Mock timer for carousel autoplay
beforeEach(() => {
  vi.useFakeTimers();
});

const mockPageContent: PageContent = {
  title: "STOP à la tromperie sur vos contenus",
  backgroundClass: "bg-black"
};

const mockNavigationItems: NavigationItem[] = [
  { label: "Le concept", path: "/", description: "Page principale" },
  { label: "Que faire ?", path: "/action", description: "Actions contre la tromperie" }
];

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

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("T011: Bidirectional Carousel Integration", () => {
  it("should render two carousel rows with different directions", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // Should find two carousel instances
    const carousels = screen.getAllByTestId('carousel-container');
    expect(carousels).toHaveLength(2);
  });

  it("should configure top carousel to scroll right", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // First carousel should have right direction
    const carousels = screen.getAllByTestId('carousel-container');
    const topCarousel = carousels[0];
    
    // Advance time to trigger scrolling
    vi.advanceTimersByTime(3000);
    
    // Should move in positive direction (right)
    // This test will pass once direction prop is properly implemented
    expect(topCarousel).toHaveAttribute('data-direction', 'right');
  });

  it("should configure bottom carousel to scroll left", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // Second carousel should have left direction  
    const carousels = screen.getAllByTestId('carousel-container');
    const bottomCarousel = carousels[1];
    
    // Advance time to trigger scrolling
    vi.advanceTimersByTime(3000);
    
    // Should move in negative direction (left)
    expect(bottomCarousel).toHaveAttribute('data-direction', 'left');
  });

  it("should have both carousels scrolling simultaneously but in opposite directions", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const carousels = screen.getAllByTestId('carousel-container');
    const topCarousel = carousels[0];
    const bottomCarousel = carousels[1];

    // Get scroll containers to check animation classes
    const topScrollContainer = topCarousel.querySelector('[data-testid="carousel-scroll-container"]');
    const bottomScrollContainer = bottomCarousel.querySelector('[data-testid="carousel-scroll-container"]');

    // Both should have animation classes for opposite directions
    expect(topScrollContainer).toHaveClass('animate-scroll-right');
    expect(bottomScrollContainer).toHaveClass('animate-scroll-left');
    
    // They should have different animation classes indicating opposite movement
    expect(topScrollContainer?.className).not.toBe(bottomScrollContainer?.className);
  });

  it("should maintain independent autoplay for each carousel", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const carousels = screen.getAllByTestId('carousel-container');
    
    // Each carousel should have CSS animations running independently
    carousels.forEach(carousel => {
      const scrollContainer = carousel.querySelector('[data-testid="carousel-scroll-container"]');
      // Should have one of the animation classes
      expect(scrollContainer).toSatisfy((el: Element) => 
        el.classList.contains('animate-scroll-right') || el.classList.contains('animate-scroll-left')
      );
    });
  });

  it("should remove section titles from carousel rows", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // Should NOT find section titles that were removed
    expect(screen.queryByText("Exemples de Tromperie de Contenu")).toBeNull();
    expect(screen.queryByText("Techniques de Manipulation Courantes")).toBeNull();
    
    // Should still have main page title
    expect(screen.getByText("STOP à la tromperie sur vos contenus")).toBeInTheDocument();
  });

  it("should maintain responsive layout with bidirectional carousels", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const carousels = screen.getAllByTestId('carousel-container');
    
    // Both carousels should maintain proper layout classes
    carousels.forEach(carousel => {
      expect(carousel).toHaveClass('relative'); // Proper positioning
      expect(carousel).toHaveClass('group'); // Group for hover effects
      
      // Check inner container for proper overflow handling
      const innerContainer = carousel.querySelector('.overflow-x-hidden');
      expect(innerContainer).toBeInTheDocument();
    });
  });
});
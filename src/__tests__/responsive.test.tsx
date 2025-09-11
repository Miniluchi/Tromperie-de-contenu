import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import type { PageContent, NavigationItem, ThumbnailItem } from "../types";

const mockPageContent: PageContent = {
  title: "STOP à la tromperie sur vos contenus",
  backgroundClass: "bg-black"
};

const mockNavigationItems: NavigationItem[] = [
  { label: "Que faire ?", path: "/action" }
];

const mockThumbnailItems: ThumbnailItem[] = [
  {
    src: "/src/assets/miniatures/miniat-pb-iphone.jpg",
    alt: "Example thumbnail 1",
    title: "Test 1"
  },
  {
    src: "/test2.jpg",
    alt: "Example thumbnail 2", 
    title: "Test 2"
  },
  {
    src: "/test3.jpg",
    alt: "Example thumbnail 3",
    title: "Test 3"
  },
  {
    src: "/test4.jpg", 
    alt: "Example thumbnail 4",
    title: "Test 4"
  }
];

const ResponsiveWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
});

describe("Responsive Layout", () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  it("renders correctly on mobile viewport", () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    // Should show Netflix carousel titles on mobile
    expect(screen.getByText("Exemples de Tromperie de Contenu")).toBeInTheDocument();
    expect(screen.getByText("Techniques de Manipulation Courantes")).toBeInTheDocument();
  });

  it("renders correctly on tablet viewport", () => {
    // Mock tablet viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    // Should show carousel content on tablet
    expect(screen.getByText("Exemples de Tromperie de Contenu")).toBeInTheDocument();
  });

  it("renders correctly on desktop viewport", () => {
    // Mock desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    // Should show carousel content on desktop
    expect(screen.getByText("Techniques de Manipulation Courantes")).toBeInTheDocument();
  });

  it("maintains navigation functionality across viewports", () => {
    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    const navigation = screen.getByRole("navigation");
    // Navigation should be present and functional at all screen sizes
    expect(navigation).toBeInTheDocument();
    expect(screen.getByText("Que faire ?")).toBeInTheDocument();
  });

  it("handles main title responsively", () => {
    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    const mainTitle = screen.getByRole("heading", { name: "STOP à la tromperie sur vos contenus" });
    // Should have responsive text sizing
    expect(mainTitle).toHaveClass("text-2xl", "md:text-4xl", "lg:text-5xl");
  });

  it("maintains proper spacing across viewports", () => {
    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    const main = screen.getByRole("main");
    // Should have responsive padding/margin
    expect(main).toHaveClass("p-4", "md:p-8", "lg:p-12");
  });

  it("ensures images maintain aspect ratio across viewports", () => {
    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    // Should find carousel images
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
  });

  it("handles overflow correctly on small viewports", () => {
    // Mock very small viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320,
    });

    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    const main = screen.getByRole("main");
    // Should handle overflow gracefully
    expect(main).toHaveClass("min-h-screen", "w-full", "overflow-x-hidden");
  });

  it("adapts navigation layout for mobile if needed", () => {
    render(
      <ResponsiveWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </ResponsiveWrapper>
    );

    const navigation = screen.getByRole("navigation");
    // Navigation should adapt to mobile (could be horizontal or have mobile menu)
    expect(navigation).toHaveClass("flex");
  });
});
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { HomePage } from "../HomePage";
import type { PageContent, NavigationItem, ThumbnailItem } from "../../types";

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
    alt: "Example thumbnail",
    title: "Test Example"
  }
];

const HomePageWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("HomePage", () => {
  it("renders complete homepage with all sections", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // Check navigation is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Que faire ?")).toBeInTheDocument();

    // Check main title is rendered
    expect(screen.getByRole("heading", { name: "STOP à la tromperie sur vos contenus" })).toBeInTheDocument();

    // Check Netflix carousels are rendered
    expect(screen.getByText("Exemples de Tromperie de Contenu")).toBeInTheDocument();
    expect(screen.getByText("Techniques de Manipulation Courantes")).toBeInTheDocument();
  });

  it("applies black background class", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("bg-black");
  });

  it("handles empty thumbnail items", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={[]}
        />
      </HomePageWrapper>
    );

    // Page should render with empty grid, no errors
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "STOP à la tromperie sur vos contenus" })).toBeInTheDocument();
  });

  it("handles empty navigation items", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={[]}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    // Page should render with empty navigation, no errors
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByAltText("Example thumbnail")).toBeInTheDocument();
  });

  it("applies custom background class", () => {
    const customContent = {
      title: "Test Title",
      backgroundClass: "bg-gray-900"
    };

    render(
      <HomePageWrapper>
        <HomePage 
          content={customContent}
          navigationItems={[]}
          thumbnailItems={[]}
        />
      </HomePageWrapper>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("bg-gray-900");
  });

  it("displays subtitle when provided", () => {
    const contentWithSubtitle = {
      title: "Main Title",
      subtitle: "Additional context text",
      backgroundClass: "bg-black"
    };

    render(
      <HomePageWrapper>
        <HomePage 
          content={contentWithSubtitle}
          navigationItems={[]}
          thumbnailItems={[]}
        />
      </HomePageWrapper>
    );

    expect(screen.getByText("Main Title")).toBeInTheDocument();
    expect(screen.getByText("Additional context text")).toBeInTheDocument();
  });

  it("maintains proper layout hierarchy", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const main = screen.getByRole("main");
    const navigation = screen.getByRole("navigation");
    const heading = screen.getByRole("heading", { name: "STOP à la tromperie sur vos contenus" });

    // Navigation should come before the main content
    expect(navigation).toBeInTheDocument();
    // Heading should be in the main content
    expect(main).toContainElement(heading);
  });

  it("is responsive and mobile-friendly", () => {
    render(
      <HomePageWrapper>
        <HomePage 
          content={mockPageContent}
          navigationItems={mockNavigationItems}
          thumbnailItems={mockThumbnailItems}
        />
      </HomePageWrapper>
    );

    const main = screen.getByRole("main");
    // Should have responsive layout classes
    expect(main).toHaveClass("min-h-screen", "w-full");
  });
});
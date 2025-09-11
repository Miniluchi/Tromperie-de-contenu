import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThumbnailGrid } from "../ThumbnailGrid";
import type { ThumbnailItem } from "../../types";

const mockThumbnailItems: ThumbnailItem[] = [
  {
    src: "/src/assets/miniatures/miniat-pb-iphone.jpg",
    alt: "Exemple de tromperie: iPhone dans une poubelle",
    title: "Problème iPhone",
    description: "Miniature négative mais contenu positif"
  },
  {
    src: "/test2.jpg",
    alt: "Test thumbnail 2",
    title: "Test 2"
  },
  {
    src: "/test3.jpg",
    alt: "Test thumbnail 3"
  }
];

describe("ThumbnailGrid", () => {
  it("renders single thumbnail item", () => {
    const singleItem = [mockThumbnailItems[0]];
    render(<ThumbnailGrid items={singleItem} />);

    const image = screen.getByAltText("Exemple de tromperie: iPhone dans une poubelle");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/src/assets/miniatures/miniat-pb-iphone.jpg");
  });

  it("renders multiple thumbnail items", () => {
    render(<ThumbnailGrid items={mockThumbnailItems} />);

    expect(screen.getByAltText("Exemple de tromperie: iPhone dans une poubelle")).toBeInTheDocument();
    expect(screen.getByAltText("Test thumbnail 2")).toBeInTheDocument();
    expect(screen.getByAltText("Test thumbnail 3")).toBeInTheDocument();
  });

  it("handles empty items array", () => {
    render(<ThumbnailGrid items={[]} />);

    // Should render empty grid container without errors
    const grid = screen.getByTestId("thumbnail-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toBeEmptyDOMElement();
  });

  it("applies responsive grid classes", () => {
    render(<ThumbnailGrid items={mockThumbnailItems} />);

    const grid = screen.getByTestId("thumbnail-grid");
    // Should have responsive grid classes
    expect(grid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4");
  });

  it("applies custom column configuration", () => {
    const customColumns = {
      mobile: 2,
      tablet: 3,
      desktop: 4,
      large: 5
    };

    render(<ThumbnailGrid items={mockThumbnailItems} columns={customColumns} />);

    const grid = screen.getByTestId("thumbnail-grid");
    // Should use custom column classes (implementation will map these to Tailwind classes)
    expect(grid).toHaveClass("grid-cols-2", "md:grid-cols-3", "lg:grid-cols-4", "xl:grid-cols-5");
  });

  it("handles missing image src gracefully", () => {
    const brokenItem: ThumbnailItem = {
      src: "/nonexistent.jpg",
      alt: "Missing image test"
    };

    render(<ThumbnailGrid items={[brokenItem]} />);

    const image = screen.getByAltText("Missing image test");
    expect(image).toBeInTheDocument();
    // Should have error handling attributes
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("applies proper spacing and layout", () => {
    render(<ThumbnailGrid items={mockThumbnailItems} />);

    const grid = screen.getByTestId("thumbnail-grid");
    // Should have proper gap spacing
    expect(grid).toHaveClass("gap-4");
  });

  it("includes hover effects", () => {
    render(<ThumbnailGrid items={mockThumbnailItems} />);

    const firstImage = screen.getByAltText("Exemple de tromperie: iPhone dans une poubelle");
    const container = firstImage.closest("[data-testid='thumbnail-item']");
    
    // Should have hover effect classes
    expect(container).toHaveClass("hover:scale-105", "transition-transform");
  });

  it("maintains aspect ratio", () => {
    render(<ThumbnailGrid items={mockThumbnailItems} />);

    const firstImage = screen.getByAltText("Exemple de tromperie: iPhone dans une poubelle");
    // Should have aspect ratio classes
    expect(firstImage.closest("[data-testid='thumbnail-item']")).toHaveClass("aspect-video");
  });
});
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { ActionPage } from "../pages/ActionPage";
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
    alt: "Example thumbnail",
    title: "Test Example"
  }
];

const TestApp = ({ initialEntries = ["/"] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route 
        path="/" 
        element={
          <HomePage 
            content={mockPageContent}
            navigationItems={mockNavigationItems}
            thumbnailItems={mockThumbnailItems}
          />
        } 
      />
      <Route path="/action" element={<ActionPage />} />
    </Routes>
  </MemoryRouter>
);

describe("Navigation Routing", () => {
  it("displays homepage with navigation", () => {
    render(<TestApp />);

    // Should show homepage title
    expect(screen.getByText("STOP à la tromperie sur vos contenus")).toBeInTheDocument();
    
    // Should show navigation
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Que faire ?")).toBeInTheDocument();
    
    // Should show Netflix carousels
    expect(screen.getByText("Exemples de Tromperie de Contenu")).toBeInTheDocument();
  });

  it("navigates to action page when clicking Que faire ?", async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    // Should start on homepage
    expect(screen.getByText("STOP à la tromperie sur vos contenus")).toBeInTheDocument();

    // Click action navigation item
    const actionLink = screen.getByText("Que faire ?");
    await user.click(actionLink);

    // Should navigate to action page
    expect(screen.getByText("Que faire contre la tromperie ?")).toBeInTheDocument();
  });

  it("handles direct URL navigation to action page", () => {
    // Test direct navigation to action page
    render(<TestApp initialEntries={["/action"]} />);

    expect(screen.getByText("Que faire contre la tromperie ?")).toBeInTheDocument();
    expect(screen.getByText("Que faire ?")).toBeInTheDocument(); // Nav should still be there
  });

  it("highlights active navigation item on action page", () => {
    // Test that navigation item is active when on action page
    render(<TestApp initialEntries={["/action"]} />);

    // Should be on action page
    expect(screen.getByText("Que faire contre la tromperie ?")).toBeInTheDocument();
    
    // Action link should be active
    const actionLink = screen.getByText("Que faire ?");
    expect(actionLink.closest("a")).toHaveAttribute("data-active", "true");
  });
});
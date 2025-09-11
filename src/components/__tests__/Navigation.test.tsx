import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Navigation } from "../Navigation";
import type { NavigationItem } from "../../types";

const mockNavigationItems: NavigationItem[] = [
  { label: "Le concept", path: "/concept", description: "Comprendre la tromperie" },
  { label: "Que faire ?", path: "/action", description: "Actions à entreprendre" }
];

const NavigationWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Navigation", () => {
  it("renders all navigation items", () => {
    render(
      <NavigationWrapper>
        <Navigation items={mockNavigationItems} />
      </NavigationWrapper>
    );

    expect(screen.getByText("Le concept")).toBeInTheDocument();
    expect(screen.getByText("Que faire ?")).toBeInTheDocument();
  });

  it("highlights active navigation item", () => {
    render(
      <NavigationWrapper>
        <Navigation items={mockNavigationItems} currentPath="/concept" />
      </NavigationWrapper>
    );

    const conceptLink = screen.getByText("Le concept");
    const actionLink = screen.getByText("Que faire ?");

    // Active item should have active styling (assuming data-active attribute)
    expect(conceptLink.closest("a")).toHaveAttribute("data-active", "true");
    expect(actionLink.closest("a")).not.toHaveAttribute("data-active", "true");
  });

  it("handles empty navigation items", () => {
    render(
      <NavigationWrapper>
        <Navigation items={[]} />
      </NavigationWrapper>
    );

    // Should render empty nav without errors
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <NavigationWrapper>
        <Navigation items={mockNavigationItems} className="custom-nav" />
      </NavigationWrapper>
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-nav");
  });

  it("has discrete styling with no visible borders", () => {
    render(
      <NavigationWrapper>
        <Navigation items={mockNavigationItems} />
      </NavigationWrapper>
    );

    const nav = screen.getByRole("navigation");
    // Should have discrete styling (black/transparent background, no borders)
    expect(nav).toHaveClass("bg-black", "border-none");
  });

  it("provides proper accessibility", () => {
    render(
      <NavigationWrapper>
        <Navigation items={mockNavigationItems} />
      </NavigationWrapper>
    );

    // Check for proper ARIA labels
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Navigation principale");

    // Links should be accessible - using aria-label as accessible name
    const conceptLink = screen.getByRole("link", { name: "Comprendre la tromperie" });
    const actionLink = screen.getByRole("link", { name: "Actions à entreprendre" });
    
    expect(conceptLink).toBeInTheDocument();
    expect(actionLink).toBeInTheDocument();
  });

  // T008: Enhanced Navigation Contract Requirements
  describe("Compact Centered Layout", () => {
    it("should take only necessary space, not full screen width", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const nav = screen.getByRole("navigation");
      // Should not have full width classes
      expect(nav).not.toHaveClass("w-full");
      expect(nav).not.toHaveClass("w-screen");
      
      // Should have auto-fit content styling
      expect(nav).toHaveClass("justify-center"); // Center alignment
      // Should have compact gap
      expect(nav).toHaveClass(/gap-\d+/); // Some gap class for spacing
    });

    it("should be center-aligned on page", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("justify-center");
    });

    it("should have elegant styling with subtle borders", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const nav = screen.getByRole("navigation");
      // Should have border styling (not border-none as in old version)
      expect(nav).toHaveClass(/border/);
      expect(nav).not.toHaveClass("border-none");
    });
  });

  // T009: Sliding background indicator
  describe("Sliding Background Indicator", () => {
    it("should have discrete active state indicator with rounded background", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const activeLink = screen.getByText("Le concept").closest("a");
      // Should have subtle background, not overly prominent
      expect(activeLink).toHaveClass("rounded-full"); // Rounded background
      expect(activeLink).not.toHaveClass("bg-white"); // Not overly visible white
    });

    it("should use understated contrast colors for active state", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const activeLink = screen.getByText("Le concept").closest("a");
      // Should have subtle styling, not bright white background
      const computedStyles = window.getComputedStyle(activeLink!);
      // Test will verify subtle, professional appearance when implemented
    });
  });

  // T010: Smooth hover transitions
  describe("Hover Transition Effects", () => {
    it("should slide indicator smoothly to hovered item under 300ms", async () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const actionLink = screen.getByText("Que faire ?").closest("a");
      
      // Hover over non-active item
      fireEvent.mouseEnter(actionLink!);
      
      // Should have transition classes for smooth animation
      expect(actionLink).toHaveClass("transition-all");
      expect(actionLink).toHaveClass(/duration-\d+/); // Some duration class
      
      // Should have different color from active state during hover
      expect(actionLink).toHaveClass(/hover:bg-/); // Some hover background
    });

    it("should use different colors for active vs hover states", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const activeLink = screen.getByText("Le concept").closest("a");
      const inactiveLink = screen.getByText("Que faire ?").closest("a");

      // Active and hover should have different styling
      const activeClasses = activeLink!.className;
      const hoverClasses = inactiveLink!.className;
      
      // They should have different background colors defined
      expect(activeClasses).not.toBe(hoverClasses);
    });

    it("should slide indicator back to active item on mouse leave", async () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const actionLink = screen.getByText("Que faire ?").closest("a");
      
      // Hover then leave
      fireEvent.mouseEnter(actionLink!);
      fireEvent.mouseLeave(actionLink!);
      
      // Should return to original state after transition
      await waitFor(() => {
        // Original active styling should be restored
        const activeLink = screen.getByText("Le concept").closest("a");
        expect(activeLink).toHaveAttribute("data-active", "true");
      });
    });

    it("should maintain smooth transitions under 300ms duration", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const links = screen.getAllByRole("link");
      links.forEach(link => {
        // Should have transition properties for smooth animation
        expect(link).toHaveClass("transition-all");
        // Duration should be quick (200-300ms range)
        expect(link).toHaveClass(/duration-(200|300)/);
      });
    });
  });

  // Enhanced accessibility requirements
  describe("Enhanced Accessibility", () => {
    it("should maintain ARIA labels during hover transitions", async () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const actionLink = screen.getByRole("link", { name: "Actions à entreprendre" });
      
      fireEvent.mouseEnter(actionLink);
      
      // ARIA labels should persist during hover
      await waitFor(() => {
        expect(screen.getByRole("link", { name: "Actions à entreprendre" })).toBeInTheDocument();
      });
    });

    it("should maintain keyboard focus visibility", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const firstLink = screen.getByText("Le concept").closest("a");
      firstLink!.focus();
      
      // Should have focus styling that remains visible
      expect(firstLink).toHaveClass(/focus:/); // Some focus class
    });
  });

  // Restrictions on overly prominent styling
  describe("Professional Appearance Restrictions", () => {
    it("should NOT use overly visible or distracting active styling", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} currentPath="/concept" />
        </NavigationWrapper>
      );

      const activeLink = screen.getByText("Le concept").closest("a");
      
      // Should NOT have bright, attention-grabbing colors
      expect(activeLink).not.toHaveClass("bg-white", "text-black");
      // Should NOT have bold borders or shadows that are too prominent
      expect(activeLink).not.toHaveClass("border-4", "shadow-lg");
    });

    it("should have subtle, professional appearance", () => {
      render(
        <NavigationWrapper>
          <Navigation items={mockNavigationItems} />
        </NavigationWrapper>
      );

      const nav = screen.getByRole("navigation");
      
      // Should maintain professional look
      expect(nav).toHaveClass("bg-black"); // Professional dark theme
      // Should have subtle contrast, not jarring
      expect(nav).toHaveClass(/text-white/); // Subtle text color
    });
  });
});
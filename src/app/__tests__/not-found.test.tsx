import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

describe("NotFound", () => {
  it("renders the 404 copy, the brand logo, and a dashboard link", () => {
    render(<NotFound />);
    expect(screen.getByText("Page not found")).toBeDefined();
    expect(screen.getByLabelText("Pista")).toBeDefined();
    const dashLink = screen.getByRole("link", { name: "Back to dashboard" });
    expect(dashLink.getAttribute("href")).toBe("/dashboard");
  });
});

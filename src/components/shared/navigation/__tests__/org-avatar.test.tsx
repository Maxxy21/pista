import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrgAvatar } from "../org-avatar";

describe("OrgAvatar", () => {
  it("shows a warm initial when the org has no uploaded image", () => {
    render(<OrgAvatar name="Acme" imageUrl="https://img.clerk.com/generated.png" hasImage={false} />);
    expect(screen.getByText("A")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders the image when the org has a real logo", () => {
    render(<OrgAvatar name="Acme" imageUrl="https://example.com/logo.png" hasImage />);
    expect(screen.getByAltText("Acme")).toBeDefined();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders the title, description, icon node, and action", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Add something to get started."
        icon={<svg data-testid="probe-icon" />}
        action={<button>Do it</button>}
      />
    );
    expect(screen.getByText("Nothing here")).toBeDefined();
    expect(screen.getByText("Add something to get started.")).toBeDefined();
    expect(screen.getByTestId("probe-icon")).toBeDefined();
    expect(screen.getByRole("button", { name: "Do it" })).toBeDefined();
  });

  it("renders no raster image", () => {
    render(
      <EmptyState
        title="Nothing here"
        description="Add something."
        icon={<svg data-testid="probe-icon" />}
      />
    );
    expect(screen.queryByRole("img")).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptySearch } from "../empty-search";

describe("EmptySearch", () => {
  it("shows the no-results copy and no raster image", () => {
    render(<EmptySearch />);
    expect(screen.getByText("No results found")).toBeDefined();
    expect(screen.queryByRole("img")).toBeNull();
  });
});

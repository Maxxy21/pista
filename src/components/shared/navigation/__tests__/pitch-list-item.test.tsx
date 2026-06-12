// src/components/shared/navigation/__tests__/pitch-list-item.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PitchListItem } from "../pitch-list-item";

describe("PitchListItem", () => {
  it("renders the title and the score", () => {
    render(
      <PitchListItem
        title="Acme AI seed deck"
        creationTime={Date.now()}
        score={7.1}
        onClick={vi.fn()}
      />
    );
    expect(screen.getByText("Acme AI seed deck")).toBeDefined();
    expect(screen.getByText("7.1")).toBeDefined();
  });
});

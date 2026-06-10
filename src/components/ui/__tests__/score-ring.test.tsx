import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreRing } from "@/components/ui/score-ring";

describe("ScoreRing", () => {
  it("shows the score to one decimal and a high-tier border", () => {
    const { container, getByText } = render(<ScoreRing score={9} />);
    expect(getByText("9.0")).toBeTruthy();
    expect(container.innerHTML).toContain("border-[hsl(var(--score-high))]");
  });
  it("uses the low-tier border for low scores", () => {
    const { container } = render(<ScoreRing score={3} />);
    expect(container.innerHTML).toContain("border-[hsl(var(--score-low))]");
  });
});

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreBadge } from "@/app/(dashboard)/dashboard/_components/cards/score-badge";

describe("ScoreBadge", () => {
  it("uses a warm olive tone for high scores", () => {
    const { container } = render(<ScoreBadge score={9} />);
    expect(container.innerHTML).toContain("text-[hsl(var(--score-high))]");
  });

  it("uses a rust tone for low scores", () => {
    const { container } = render(<ScoreBadge score={2} />);
    expect(container.innerHTML).toContain("text-[hsl(var(--score-low))]");
  });

  it("renders nothing when score is undefined", () => {
    const { container } = render(<ScoreBadge />);
    expect(container.firstChild).toBeNull();
  });
});

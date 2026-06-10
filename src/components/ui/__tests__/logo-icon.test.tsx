import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LogoIcon from "@/components/ui/logo-icon";

describe("LogoIcon", () => {
  it("renders an svg mark with a top bar and three rising bars (4 rects)", () => {
    const { container } = render(<LogoIcon />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(container.querySelectorAll("rect").length).toBe(4);
  });
});

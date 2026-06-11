// src/components/shared/landing/components/__tests__/verdict-card.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerdictCard } from "../verdict-card";
import { sampleEvaluation } from "../sample-data";

describe("VerdictCard", () => {
  it("renders the verdict line and category labels", () => {
    render(<VerdictCard />);
    expect(screen.getByText(sampleEvaluation.verdict)).toBeDefined();
    expect(screen.getByText("Problem-Solution Fit")).toBeDefined();
  });
});

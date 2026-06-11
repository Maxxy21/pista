import { describe, it, expect } from "vitest";
import { sampleEvaluation } from "../sample-data";

describe("sampleEvaluation", () => {
  it("has a numeric overall score and a verdict", () => {
    expect(typeof sampleEvaluation.overallScore).toBe("number");
    expect(sampleEvaluation.verdict.length).toBeGreaterThan(0);
  });

  it("has non-empty categories with criteria + score", () => {
    expect(sampleEvaluation.categories.length).toBeGreaterThan(0);
    for (const c of sampleEvaluation.categories) {
      expect(typeof c.criteria).toBe("string");
      expect(typeof c.score).toBe("number");
    }
  });
});

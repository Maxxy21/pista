import { describe, it, expect } from "vitest";
import {
  getScoreColor, getSeverityColor, getViabilityColor,
  getExecutionColor, getImpactColor, getPriorityColor,
} from "@/lib/utils/evaluation-colors";

describe("warm evaluation colors", () => {
  it("scores map to warm tiers", () => {
    expect(getScoreColor(9)).toContain("--score-high");
    expect(getScoreColor(6)).toContain("--score-mid");
    expect(getScoreColor(3)).toContain("--score-low");
  });
  it("severity: High is rust(low), Low is olive(high)", () => {
    expect(getSeverityColor("High")).toContain("--score-low");
    expect(getSeverityColor("Low")).toContain("--score-high");
  });
  it("viability/execution/impact/priority", () => {
    expect(getViabilityColor("Strong")).toContain("--score-high");
    expect(getViabilityColor("Weak")).toContain("--score-low");
    expect(getExecutionColor("Poor")).toContain("--score-low");
    expect(getImpactColor("High")).toContain("--score-high");
    expect(getPriorityColor("Critical")).toContain("--score-low");
  });
  it("unknown values fall back to muted (no score token)", () => {
    expect(getViabilityColor("Not Applicable")).not.toContain("--score-");
  });
});

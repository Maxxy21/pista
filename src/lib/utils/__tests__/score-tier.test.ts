import { describe, it, expect } from "vitest";
import { getScoreTier } from "@/lib/utils/score";

describe("getScoreTier", () => {
  it("high at 7.5 and above", () => {
    expect(getScoreTier(10)).toBe("high");
    expect(getScoreTier(7.5)).toBe("high");
  });
  it("mid between 5 and 7.5", () => {
    expect(getScoreTier(7.4)).toBe("mid");
    expect(getScoreTier(5)).toBe("mid");
  });
  it("low below 5", () => {
    expect(getScoreTier(4.9)).toBe("low");
    expect(getScoreTier(0)).toBe("low");
  });
});

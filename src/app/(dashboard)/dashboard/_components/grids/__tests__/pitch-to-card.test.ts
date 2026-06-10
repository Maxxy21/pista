import { describe, it, expect } from "vitest";
import { toPitchCardProps } from "../pitch-to-card";

const base = {
  _id: "p1" as any,
  title: "T",
  text: "body",
  type: "audio",
  userId: "u1",
  authorName: "A",
  _creationTime: 0,
  orgId: "o1",
  isFavorite: false,
  evaluation: { overallScore: 8 },
};

describe("toPitchCardProps", () => {
  it("maps audio input type to AUDIO", () => {
    expect(toPitchCardProps(base as any, () => {}).inputType).toBe("AUDIO");
  });
  it("maps textFile and text to TEXT", () => {
    expect(toPitchCardProps({ ...base, type: "textFile" } as any, () => {}).inputType).toBe("TEXT");
    expect(toPitchCardProps({ ...base, type: "text" } as any, () => {}).inputType).toBe("TEXT");
  });
});

// src/app/(dashboard)/dashboard/_components/new-pitch/__tests__/processing-status.test.tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessingStatus } from "../processing-status";
import { useEvaluationProgress } from "@/hooks/use-evaluation-progress";

describe("ProcessingStatus", () => {
  beforeEach(() => {
    useEvaluationProgress.setState({ step: "idle", message: undefined, progress: undefined });
  });

  it("shows all three stages for an audio pitch while analyzing", () => {
    useEvaluationProgress.setState({ step: "analyzing" });
    render(<ProcessingStatus type="audio" />);
    expect(screen.getByText("Reading your pitch like an investor would…")).toBeDefined();
    expect(screen.getByText("Upload")).toBeDefined();
    expect(screen.getByText("Transcribe")).toBeDefined();
    expect(screen.getByText("Analyze")).toBeDefined();
  });

  it("shows only the Analyze stage for a text pitch", () => {
    useEvaluationProgress.setState({ step: "analyzing" });
    render(<ProcessingStatus type="text" />);
    expect(screen.getByText("Analyze")).toBeDefined();
    expect(screen.queryByText("Upload")).toBeNull();
  });

  it("renders the error state with a retry button", () => {
    useEvaluationProgress.setState({ step: "error", message: "Boom" });
    render(<ProcessingStatus type="text" onRetry={() => {}} />);
    expect(screen.getByText("Evaluation failed")).toBeDefined();
    expect(screen.getByText("Retry")).toBeDefined();
  });
});

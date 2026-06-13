import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthScreen } from "../auth-screen";

describe("AuthScreen", () => {
  it("renders the title, subtitle, description, and children", () => {
    render(
      <AuthScreen
        eyebrow="Test eyebrow"
        title="Welcome back."
        subtitle="Your pitches are waiting."
        description="Sign in to keep refining your pitch."
      >
        <div data-testid="form-probe">form goes here</div>
      </AuthScreen>
    );
    expect(screen.getByText("Test eyebrow")).toBeDefined();
    expect(screen.getByText("Welcome back.")).toBeDefined();
    expect(screen.getByText("Your pitches are waiting.")).toBeDefined();
    expect(screen.getByText("Sign in to keep refining your pitch.")).toBeDefined();
    expect(screen.getByTestId("form-probe")).toBeDefined();
  });

  it("renders the Pista wordmark via LogoIcon", () => {
    render(
      <AuthScreen eyebrow="e" title="t" subtitle="s" description="d">
        <div />
      </AuthScreen>
    );
    expect(screen.getAllByLabelText("Pista").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pista").length).toBeGreaterThan(0);
  });
});

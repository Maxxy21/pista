import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SystemScreen } from "../system-screen";

describe("SystemScreen", () => {
  it("renders title, description, icon node, and actions", () => {
    render(
      <SystemScreen
        icon={<svg data-testid="probe-icon" />}
        title="Page not found"
        description="It moved."
        actions={<button>Go home</button>}
      />
    );
    expect(screen.getByText("Page not found")).toBeDefined();
    expect(screen.getByText("It moved.")).toBeDefined();
    expect(screen.getByTestId("probe-icon")).toBeDefined();
    expect(screen.getByRole("button", { name: "Go home" })).toBeDefined();
  });

  it("applies the destructive medallion tone", () => {
    const { container } = render(
      <SystemScreen tone="destructive" icon={<svg data-testid="probe-icon" />} title="Boom" description="d" />
    );
    expect(container.querySelector(".bg-destructive\\/10")).not.toBeNull();
  });

  it("applies the default (bordered) medallion tone", () => {
    const { container } = render(
      <SystemScreen icon={<svg data-testid="probe-icon" />} title="Ok" description="d" />
    );
    expect(container.querySelector(".bg-card")).not.toBeNull();
    expect(container.querySelector(".bg-destructive\\/10")).toBeNull();
  });
});
